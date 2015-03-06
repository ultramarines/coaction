from .extensions import db , login_manager
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


    def to_dict(self):
        return {"id": self.id,
                "title": self.title,
                "description": self.description,
                "status": self.status,
                "user_id": self.user_id,
                "project_id": self.project_id,
                "date_assigned": str(self.date_assigned),
                "date_due": str(self.date_due)}



# class User(db.Model, UserMixin):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     name = db.Column(db.String(255), nullable=False)
#     email = db.Column(db.String(255), unique=True, nullable=False)
#     encrypted_password = db.Column(db.String(60))
#     Task = db.relationship('Task', backref='user')
#
#
#     def get_password(self):
#         return getattr(self, "_password", None)
#
#
#     def set_password(self, password):
#         self._password = password
#         self.encrypted_password = bcrypt.generate_password_hash(password)
#
#     password = property(get_password, set_password)
#
#     def check_password(self, password):
#         return bcrypt.check_password_hash(self.encrypted_password, password)
#
#     def __repr__(self):
#         return "<User {}>".format(self.email)
#
#
#     @login_manager.user_loader
#     def load_user(id):
#         return User.query.get(id)
