from flask import Blueprint, request, jsonify
from flask.ext.login import login_user, logout_user, login_required, current_user

from .models import Task, User, Comment, Assignment
from .forms import TaskForm, RegistrationForm, LoginForm, CommentForm, AssignmentForm
from .extensions import db
import json
from datetime import date, datetime

coaction = Blueprint("coaction", __name__, static_folder="./static")

@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")

## Add your API views here


@coaction.route("/api/assignments", methods=["GET"])
@login_required
def get_assignments():
    assignments = Assignment.query.filter_by(user_id=current_user.id).all()
    tasks = []
    for assignment in assignments:
        task = Task.query.filter_by(id=assignment.task_id).first()
        tasks.append(task)
    tasks = [task.to_dict() for task in tasks]
    return jsonify({"tasks": tasks}), 201

@coaction.route("/api/tasks", methods=["GET"])
@login_required
def get_tasks():
    tasks = Task.query.filter_by(user_id = current_user.id)
    tasks = [task.to_dict() for task in tasks]
    return jsonify({"tasks": tasks}), 201


@coaction.route("/api/tasks", methods=["POST"])
@login_required
def create_task():
    body = request.get_data(as_text=True)
    data = json.loads(body)
    #  Enter Required data into Form
    form = TaskForm(title=data['title'],
                    status="new",
                    index="0",
                    formdata=None, csrf_enabled=False)
    # Enter Optional data into Form
    if 'description' in data:
        form.description.data = data['description']
    if 'date_due' in data:
        form.date_due.data = data['date_due']
    # Validate Form
    if form.validate():
        duplicate = Task.query.filter_by(title=form.title.data, user_id = current_user.id).first()
        # Enter Required Data into Model
        if not duplicate:
            task = Task(title=form.title.data,
                        status=form.status.data,
                        user_id = current_user.id,
                        project_id=0,
                        date_assigned=date.today(),
                        index=form.index.data)
            # Enter Optional Data Into Model
            if form.description.data:
                task.description = form.description.data
            if form.date_due.data:
                data_date = datetime.strptime(data['date_due'], "%Y-%m-%d")
                task.date_due = data_date
            db.session.add(task)
            db.session.commit()
            task = task.to_dict()
            return (jsonify({ 'task': task }), 201)

        else:
            return jsonify({"ERROR": "duplicate task"}), 406
    else:
        return form.errors, 400

@coaction.route("/api/tasks/<int:id>", methods=["DELETE"])
@login_required
def delete_task(id):
    task = Task.query.filter_by(id = id).first()
    if task:
        db.session.delete(task)
        db.session.commit()
        return (jsonify({ 'task': task.to_dict() }), 201)
    else:
        return jsonify({"ERROR": "task not found"}), 406

@coaction.route("/api/tasks/<int:id>", methods=['PUT'])
@login_required
def update_task(id):
    input_check = False
    body = request.get_data(as_text=True)
    data = json.loads(body)
    keys = data.keys()
    task = Task.query.filter_by(id=id).first()
    if len(keys) < 6:
        if 'title' in keys:
            task.title = data['title']
            input_check = True
        if 'description' in keys:
            task.description = data['description']
            input_check = True
        if 'project_id' in keys:
            task.project_id = data['project_id']
            input_check = True
        if 'status' in keys:
            if data['status'] in ['new', 'started', 'done']:
                task.status = data['status']
                input_check = True
            else:
                return jsonify({"ERROR": "Invalid Data Input"}), 401
        if 'assigned_to' in keys:
            assignees = data['assigned_to']
            old_assignments = Assignment.query.filter_by(task_id=task.id).all()
            for old_assignment in old_assignments:
                db.session.delete(old_assignment)
            for assignee in assignees:
                user = User.query.filter_by(email=assignee).first()
                if user and not Assignment.query.filter_by(task_id=task.id, user_id=user.id).all():
                    assignment = Assignment(task_id=task.id, user_id=user.id)
                    db.session.add(assignment)
            task.assigned_by = current_user.email
            input_check = True
        if 'date_assigned' in keys:
            data_date = datetime.strptime(data['date_assigned'], "%Y-%m-%d")
            task.date_assigned = data_date
            input_check = True
        if 'date_due' in keys:
            data_date = datetime.strptime(data['date_due'], "%Y-%m-%d")
            task.date_due = data_date
            input_check = True
        if input_check:
            db.session.commit()
            return jsonify({'task': task.to_dict()}), 201
        else:
            return jsonify({"ERROR": "Invalid Data Input"}), 401
    else:
        return jsonify({"ERROR": "Too Many Input Variables"}), 401

@coaction.route("/api/tasks/<int:id>/comments", methods=["GET"])
@login_required
def get_comments(id):
    comments = Comment.query.filter_by(task_id = id).all()
    comments = [comment.to_dict() for comment in comments]
    return jsonify({"comments": comments}), 201


@coaction.route("/api/tasks/<int:id>/comments", methods = ["POST"])
@login_required
def make_comment(id):
    body = request.get_data(as_text=True)
    data = json.loads(body)
    #  Enter Required data into Form
    form = CommentForm(comment=data['comment'],
                       task_id = id,
                       formdata=None, csrf_enabled=False)

    if form.validate():
            comment = Comment(task_id = id, comment = form.comment.data)
            db.session.add(comment)
            db.session.commit()
            comment = comment.to_dict()

            return (jsonify({ 'comment': comment }), 201)

    else:
        return form.errors, 400

@coaction.route("/api/task_assignment", methods=["GET"])
@login_required
def view_task_assignments():
    tasks = Task.query.filter_by(assigned_by = current_user.email)
    tasks = [task.to_dict() for task in tasks]
    return jsonify({"tasks": tasks}), 201

@coaction.route("/api/login", methods=['POST'])
def login():
    body = request.get_data(as_text=True)
    data = json.loads(body)
    form = LoginForm(email=data['email'],
                     password=data['password'],
                     formdata=None, csrf_enabled=False)
    if form.validate() and not current_user.is_authenticated():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return jsonify({'user': user.to_dict()}), 201
        else:
            return jsonify({"ERROR": "Invalid Email or Password"}), 401
    else:
        return jsonify({"ERROR": "Invalid Login Parameters"}), 401


@coaction.route("/api/register", methods=['POST'])
def register_user():
    body = request.get_data(as_text=True)
    data = json.loads(body)
    #  Enter Required data into Form
    form = RegistrationForm(name=data['name'],
                            email=data['email'],
                            password=data['password'],
                            formdata=None, csrf_enabled=False)
    if form.validate():
        duplicate = User.query.filter_by(email=form.email.data).first()
        if not duplicate:
            user = User(name=form.name.data,
                        email=form.email.data,
                        password=form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return jsonify({'user': user.to_dict() }), 201
        else:
            return jsonify({"ERROR": "Account with that email already exists"}), 401
    else:
        return jsonify({"ERROR": "Invalid form data"}), 401


@coaction.route("/api/logout", methods=['GET'])
@login_required
def logout():
    if current_user.is_authenticated():
        user = User.query.filter_by(id=current_user.id).first()
        logout_user()
        return jsonify({'user': user.to_dict()}), 201
    else:
        return jsonify({"ERROR": "No user is logged in."}), 401

@coaction.route("/api/me", methods=['GET'])
def get_current_user():
    if current_user.is_authenticated():
        user = User.query.filter_by(id = current_user.id).first()
        return jsonify({'user': user.to_dict()}), 201
    else:
        return jsonify({"ERROR": "No user is logged in."}), 401

@coaction.route("/api/users", methods=['GET'])
def get_users():
    users = User.query.all()
    users = [user.to_dict() for user in users]
    if users:
        return jsonify({'users': users}), 201
    else:
        return jsonify({"ERROR": "No users available."}), 401
