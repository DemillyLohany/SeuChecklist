from logging.config import fileConfig
from pathlib import Path
import sys

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

PASTA_PROJETO = Path(__file__).resolve().parents[1]
PASTA_BACKEND = PASTA_PROJETO / "backend"

# Permite ao Alembic encontrar database.py e os modelos.
sys.path.insert(0, str(PASTA_BACKEND))

from backend.database import DATABASE_URL
import backend.models.tarefa_model
import backend.models.usuario_model

target_metadata = SQLModel.metadata

# Usa a mesma URL do banco que a API.
config.set_main_option("sqlalchemy.url", DATABASE_URL.replace("%", "%%"))


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuracao = config.get_section(config.config_ini_section, {})

    connectable = engine_from_config(
        configuracao,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as conexao:
        context.configure(
            connection=conexao,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()