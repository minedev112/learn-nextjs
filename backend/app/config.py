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

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
