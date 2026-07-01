from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Full SQLAlchemy database URL. Defaults to a local Postgres so the app
    # can boot with docker-compose without extra configuration.
    database_url: str = "postgresql+psycopg://blog:blog@localhost:5432/blog"

    # Comma-separated list of allowed CORS origins ("*" allows everything).
    cors_origins: str = "*"

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
