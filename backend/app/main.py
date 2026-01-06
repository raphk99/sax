from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.parse import router as parse_router


def create_app() -> FastAPI:
    app = FastAPI(title="MusicXML to Alto Sax Fingering API", version="0.1.0")

    # CORS configuration - must be added before routes
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://raphk99.github.io",  # GitHub Pages
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],  # Expose all headers to the client
        max_age=3600,  # Cache preflight requests for 1 hour
    )

    app.include_router(parse_router, prefix="/api")
    
    @app.get("/api/health")
    async def health_check():
        """Health check endpoint for Render."""
        return {"status": "healthy", "service": "sax-backend"}
    
    return app


app = create_app()


