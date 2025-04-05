"""Ajout de la colonne statut à la table Etudiant

Revision ID: 301cb02d45b6
Revises: 
Create Date: 2025-03-31 12:35:37.259551

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '301cb02d45b6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('classe')
    op.drop_table('paiement')
    op.drop_table('token_blacklist')
    op.drop_table('niveau')
    op.drop_table('user')
    op.drop_table('inscription')
    op.drop_table('annee_scolaire')
    op.drop_table('etudiant')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('etudiant',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('etudiant_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('nom', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('prenom', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('matricule', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('telephone', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('sexe', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('classe_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('keyetudiant', sa.VARCHAR(length=32), server_default=sa.text("replace((uuid_generate_v4())::text, '-'::text, ''::text)"), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.Column('statut', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['classe_id'], ['classe.id'], name='etudiant_classe_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='etudiant_pkey'),
    sa.UniqueConstraint('email', name='etudiant_email_key'),
    sa.UniqueConstraint('matricule', name='etudiant_matricule_key'),
    postgresql_ignore_search_path=False
    )
    op.create_table('annee_scolaire',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('annee_scolaire_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('date_debut', sa.DATE(), autoincrement=False, nullable=False),
    sa.Column('date_fin', sa.DATE(), autoincrement=False, nullable=False),
    sa.Column('statut', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('annee_en_cours', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.Column('libelle', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('keyannee', sa.VARCHAR(length=32), server_default=sa.text("replace((uuid_generate_v4())::text, '-'::text, ''::text)"), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='annee_scolaire_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('inscription',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('inscription_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('etudiant_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('classe_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('annee_scolaire_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('date_inscription', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('montant_paye', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('reste_a_payer', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('statut', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('keyinscription', sa.VARCHAR(length=32), server_default=sa.text("replace((uuid_generate_v4())::text, '-'::text, ''::text)"), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['annee_scolaire_id'], ['annee_scolaire.id'], name='inscription_annee_scolaire_id_fkey'),
    sa.ForeignKeyConstraint(['classe_id'], ['classe.id'], name='inscription_classe_id_fkey'),
    sa.ForeignKeyConstraint(['etudiant_id'], ['etudiant.id'], name='inscription_etudiant_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='inscription_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('username', sa.VARCHAR(length=80), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('password_hash', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('role', sa.VARCHAR(length=20), autoincrement=False, nullable=False),
    sa.Column('keyuser', sa.VARCHAR(length=32), server_default=sa.text("replace((uuid_generate_v4())::text, '-'::text, ''::text)"), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='user_pkey'),
    sa.UniqueConstraint('email', name='user_email_key'),
    sa.UniqueConstraint('password_hash', name='user_password_hash_key'),
    sa.UniqueConstraint('username', name='user_username_key')
    )
    op.create_table('niveau',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('niveau_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('nom', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('statut', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('keyniveau', sa.VARCHAR(length=32), server_default=sa.text("replace((uuid_generate_v4())::text, '-'::text, ''::text)"), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='niveau_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('token_blacklist',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('jti', sa.VARCHAR(length=120), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='token_blacklist_pkey'),
    sa.UniqueConstraint('jti', name='token_blacklist_jti_key')
    )
    op.create_table('paiement',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('inscription_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('montant', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('statut', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('date_paiement', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['inscription_id'], ['inscription.id'], name='paiement_inscription_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='paiement_pkey')
    )
    op.create_table('classe',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('nom', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('nombre_etudiants', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('montant', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('niveau_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('statut', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('libelle', sa.VARCHAR(length=255), server_default=sa.text("'Classe sans libellé'::character varying"), autoincrement=False, nullable=False),
    sa.Column('keyclasse', sa.VARCHAR(length=32), server_default=sa.text("replace((uuid_generate_v4())::text, '-'::text, ''::text)"), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['niveau_id'], ['niveau.id'], name='classe_niveau_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='classe_pkey'),
    sa.UniqueConstraint('libelle', name='uq_classe_libelle'),
    sa.UniqueConstraint('nom', name='classe_nom_key')
    )
    # ### end Alembic commands ###
