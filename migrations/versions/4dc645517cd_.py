"""empty message

Revision ID: 4dc645517cd
Revises: 60faa60f2f
Create Date: 2015-03-07 14:08:39.697199

"""

# revision identifiers, used by Alembic.
revision = '4dc645517cd'
down_revision = '60faa60f2f'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('task', sa.Column('assigned_to', sa.String(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('task', 'assigned_to')
    ### end Alembic commands ###
