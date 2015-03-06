"""empty message

Revision ID: ae0a9ac91d
Revises: f8522a2f9b
Create Date: 2015-03-05 15:44:55.036911

"""

# revision identifiers, used by Alembic.
revision = 'ae0a9ac91d'
down_revision = 'f8522a2f9b'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), nullable=False),
    sa.Column('email', sa.VARCHAR(length=255), nullable=False),
    sa.Column('encrypted_password', sa.VARCHAR(length=60), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###