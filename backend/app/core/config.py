import json
from typing import Annotated, List, Literal, Union
from pydantic import AnyHttpUrl, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from sqlalchemy.engine import make_url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

    ENVIRONMENT: Literal["development", "test", "production"] = "development"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "JARI Backend API"
    SECRET_KEY: SecretStr = SecretStr("local-development-only-change-before-deploying")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    DATABASE_URL: SecretStr = SecretStr("postgresql+psycopg://jari_user:jari_dev_password@localhost:5432/jari_db")
    # Render commonly supplies this as a plain URL, while local/example config
    # may use a JSON list. NoDecode lets our validator accept both forms before
    # pydantic-settings tries to JSON-decode environment values.
    BACKEND_CORS_ORIGINS: Annotated[List[Union[AnyHttpUrl, str]], NoDecode] = ["http://localhost:3000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            value = v.strip()
            if not value:
                return []
            if value.startswith("["):
                try:
                    v = json.loads(value)
                except json.JSONDecodeError as exc:
                    raise ValueError("BACKEND_CORS_ORIGINS must be a URL or a JSON array of URLs.") from exc
            else:
                v = [origin.strip() for origin in value.split(",") if origin.strip()]
        if isinstance(v, list):
            return v
        raise ValueError("BACKEND_CORS_ORIGINS must be a URL or a JSON array of URLs.")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        """Normalize provider connection URLs for the installed psycopg 3 driver."""
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        if self.ENVIRONMENT != "production":
            return self

        secret = self.SECRET_KEY.get_secret_value()
        if (
            len(secret) < 32
            or secret == "local-development-only-change-before-deploying"
            or "replace_with" in secret.lower()
            or "change_this" in secret.lower()
        ):
            raise ValueError("Production requires a private SECRET_KEY of at least 32 characters.")

        try:
            database_url = make_url(self.DATABASE_URL.get_secret_value())
        except Exception:
            raise ValueError("DATABASE_URL must be a valid PostgreSQL URI; URL-encode reserved password characters.") from None

        if database_url.drivername != "postgresql+psycopg" or not database_url.host or not database_url.database:
            raise ValueError("DATABASE_URL must identify a PostgreSQL database and use the psycopg driver.")

        host = database_url.host.lower()
        if host.endswith("supabase.co") or host.endswith("pooler.supabase.com"):
            if not host.endswith("pooler.supabase.com") or database_url.port != 5432:
                raise ValueError("Render must use the Supabase Session pooler URI on port 5432, not the direct or transaction-pooler URI.")
            sslmode = (database_url.query or {}).get("sslmode", "")
            if sslmode not in {"require", "verify-ca", "verify-full"}:
                raise ValueError("Supabase DATABASE_URL must enable TLS with sslmode=require.")
            if not database_url.password or "URL_ENCODED" in database_url.password.upper():
                raise ValueError("DATABASE_URL still contains a password placeholder; set the Supabase database password.")

        origins = [str(origin).rstrip("/").lower() for origin in self.BACKEND_CORS_ORIGINS]
        if not origins or any(not origin.startswith("https://") for origin in origins):
            raise ValueError("Production BACKEND_CORS_ORIGINS must contain exact HTTPS frontend origins.")
        return self


settings = Settings()
