from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.product import Product
from schemas import ProductCreate
from utils.utils import get_session_local

router = APIRouter()

@router.post("/create-many")
def create_product(products: list[ProductCreate], db: Session = Depends(get_session_local)):
    for product in products:    
        db_product = Product(name=product.name, price=product.price)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)

    return db_product
