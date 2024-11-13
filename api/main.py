from fastapi import FastAPI
from database import engine, Base
from routers import user, product, rma

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(product.router, prefix="/products", tags=["products"])
app.include_router(rma.router, prefix="/rmas", tags=["rmas"])
