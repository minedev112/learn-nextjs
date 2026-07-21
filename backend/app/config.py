from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Full SQLAlchemy database URL. Defaults to a local Postgres so the app
    # can boot with docker-compose without extra configuration.
    database_url: str = "postgresql+psycopg://blog:blog@localhost:5432/blog"

    # Comma-separated list of allowed CORS origins ("*" allows everything).
    cors_origins: str = "*"

    # Directory where uploaded media is stored, and the public base URL used to
    # build absolute links back to those files (served under /static/uploads).
    upload_dir: str = "./static/uploads"
    public_base_url: str = "http://localhost:8000"

    # Auth: HMAC key that signs JWT access tokens (CHANGE in production) and how
    # long an issued token stays valid. The admin_* pair seeds the single admin
    # user on first boot — used only when the users table is empty.
    jwt_secret: str = "dev-insecure-change-me"
    jwt_expire_minutes: int = 60 * 24  # 24 hours
    admin_username: str = "admin"
    admin_password: str = "changeme"

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
