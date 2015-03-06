from flask_wtf import Form
from wtforms import StringField, DateField, IntegerField
from wtforms.validators import DataRequired
"""Add your forms here."""


class TaskForm(Form):
    title = StringField(validators=[DataRequired()])
    description = StringField()
    status = StringField(validators=[DataRequired()])
    date_due = DateField()
    index = IntegerField(validators=[DataRequired()])
