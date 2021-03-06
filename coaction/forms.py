from flask_wtf import Form
from wtforms import StringField, DateField, IntegerField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email
"""Add your forms here."""


class TaskForm(Form):
    title = StringField(validators=[DataRequired()])
    description = StringField()
    status = StringField(validators=[DataRequired()])
    date_due = DateField()
    index = IntegerField(validators=[DataRequired()])
    assigned_to = EmailField()

class RegistrationForm(Form):
    name = StringField(validators=[DataRequired()])
    email = EmailField(validators=[DataRequired(), Email()])
    password = PasswordField(validators=[DataRequired()])


class LoginForm(Form):
    email = EmailField(validators=[DataRequired(), Email()])
    password = PasswordField(validators=[DataRequired()])


class AssignmentForm(Form):
    user_id = IntegerField(validators=[DataRequired()])
    task_id = IntegerField(validators=[DataRequired()])


class CommentForm(Form):
    comment = StringField(validators=[DataRequired()])
