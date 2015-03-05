from flask import Blueprint, flash, request, jsonify
from .models import Task
from .forms import TaskForm
from .extensions import db
import json

coaction = Blueprint("coaction", __name__, static_folder="./static")


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here

@coaction.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()

    tasks  = [task.to_dict() for task in tasks]

    return jsonify({"tasks": tasks}), 201


@coaction.route("/api/tasks", methods=["POST"])
def create_task():
    body = request.get_data(as_text = True)

    data = json.loads(body)
    form = TaskForm(title = data['title'], formdata = None, csrf_enabled = False)

    if form.validate():
        duplicate = Task.query.filter_by(title = form.title.data).first()

        if not duplicate:
            task = Task(title = form.title.data,
                        project_id = 0)
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
   if len(keys) < 4:
       if 'title' in keys:
           task.title= data['title']
           input_check = True
       if 'project_id' in keys:
           task.project_id = data['project_id']
           input_check = True
       if 'completed' in keys:
           task.completed = data['completed']
           input_check = True
       if 'user_id' in keys:
           task.user_id = data['user_id']
           input_check = True

       if input_check:
           db.session.commit()
           return (jsonify({ 'task': task.to_dict() }), 201)
   else:
       return json_response(400, "Invalid Input")
