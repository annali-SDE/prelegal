from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from prelegal.core.config import settings
from prelegal.core.database import init_db
from prelegal.routers import auth, chat, documents, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(documents.router)


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def api_not_found(path: str):
    return JSONResponse({"detail": "Not Found"}, status_code=404)


dist = Path(settings.frontend_dist_dir)
if dist.exists():
    app.mount("/", StaticFiles(directory=dist, html=True), name="frontend")
