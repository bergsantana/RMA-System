from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.product import Product
from schemas import ProductCreate

router = APIRouter()

@router.post("/products/")
def create_product(product: ProductCreate, db: Session = Depends(SessionLocal)):
    db_product = Product(name=product.name, price=product.price, quantity=product.quantity)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
