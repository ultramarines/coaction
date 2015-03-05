from flask_wtf import Form
from wtforms import StringField, PasswordField,DateField, IntegerField
from wtforms.validators import DataRequired
"""Add your forms here."""


class TaskForm(Form):
    title = StringField(validators=[DataRequired()])
