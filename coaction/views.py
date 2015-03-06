from flask import Blueprint, flash, request, jsonify
from flask.ext.login import login_user, logout_user, login_required

from .models import Task, User
from .forms import TaskForm, RegistrationForm, LoginForm
from .extensions import db, login_manager
import json
from datetime import date, datetime

coaction = Blueprint("coaction", __name__, static_folder="./static")


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here

@coaction.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    tasks = [task.to_dict() for task in tasks]
    return jsonify({"tasks": tasks}), 201


@coaction.route("/api/tasks", methods=["POST"])
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
        duplicate = Task.query.filter_by(title=form.title.data).first()
        # Enter Required Data into Model
        if not duplicate:
            task = Task(title=form.title.data,
                        status=form.status.data,
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
def delete_task(id):
    task = Task.query.filter_by(id = id).first()

    if task:
        db.session.delete(task)
        db.session.commit()
        return (jsonify({ 'task': task.to_dict() }), 201)

    else:
        return jsonify({"ERROR": "task not found"}), 406


@coaction.route("/api/tasks/<int:id>", methods=['PUT'])
def update_activity(id):
    # user = require_authorization()
    input_check = False
    body = request.get_data(as_text=True)
    data = json.loads(body)
    keys = data.keys()
    task = Task.query.filter_by(id=id).first()
    print("Before length")
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
        if 'user_id' in keys:
            task.user_id = data['user_id']
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
            print("Commit")
            db.session.commit()
            print("task")
            return jsonify({'task': task.to_dict() }), 201
        else:
            return jsonify({"ERROR": "Invalid Data Input"}), 401
    else:
        print("error")
        return jsonify({"ERROR": "Too Many Input Variables"}), 401

@coaction.route("/api/register", methods = ['POST'])
def register_user():
        body = request.get_data(as_text=True)
        data = json.loads(body)
        #  Enter Required data into Form
        form = RegistrationForm(name = data['name'],
                            email = data['email'],
                            password = data['password'],
                            formdata=None, csrf_enabled=False)

        if form.validate():
            duplicate = User.query.filter_by(email = form.email.data).first()

            if not duplicate:
                user = User(name = form.name.data,
                            email = form.email.data,
                            password = form.password.data)

                db.session.add(user)
                db.session.commit()
                login_user(user)

                return jsonify({'user': user.to_dict() }), 201

            else:
                return jsonify({"ERROR": "Account with that email already exists"}), 401

        else:

            return jsonify({"ERROR": "Invalid form data"}), 401
