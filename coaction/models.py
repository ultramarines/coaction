from .extensions import db, login_manager, bcrypt
from flask.ext.login import UserMixin


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(32), nullable=False, default="New")
    user_id = db.Column(db.Integer, nullable=False, default=0)
    project_id = db.Column(db.Integer)
    date_assigned = db.Column(db.Date, nullable=False)
    date_due = db.Column(db.Date)
    index = db.Column(db.Integer)
    assigned_by = db.Column(db.String)
    assigned_to = db.Column(db.String)

    def to_dict(self):
        return {"id": self.id,
                "title": self.title,
                "description": self.description,
                "status": self.status,
                "user_id": self.user_id,
                "project_id": self.project_id,
                "date_assigned": str(self.date_assigned),
                "date_due": str(self.date_due),
                "assigned_by": self.assigned_by,
                "assigned_to":self.assigned_to}


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    encrypted_password = db.Column(db.String(60))

    def to_dict(self):
        return {"id": self.id,
                "name": self.name,
                "email": self.email
                }

    def get_password(self):
        return getattr(self, "_password", None)

    def set_password(self, password):
        self._password = password
        self.encrypted_password = bcrypt.generate_password_hash(password)

    password = property(get_password, set_password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.encrypted_password, password)

    def __repr__(self):
        return "<User {}>".format(self.email)

    @login_manager.user_loader
    def load_user(id):
        print("Check if load user happens")
        return User.query.get(id)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_id = db.Column(db.Integer, nullable=False, default=0)
    comment = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {"id": self.id,
                "task_id": self.task_id,
                "comment": self.comment}
