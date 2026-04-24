from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env at the project root regardless of working directory
_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(_ENV_FILE), extra="ignore")

    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 7

    db_path: str = "./prelegal.db"
    frontend_dist_dir: str = "../frontend/out"
    cookie_name: str = "prelegal_token"
    openrouter_api_key: str = ""


settings = Settings()
