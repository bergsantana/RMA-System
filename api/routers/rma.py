from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.rma import RMA
from schemas import RMACreate

router = APIRouter()

@router.post("/rmas/")
def create_rma(rma: RMACreate, db: Session = Depends(SessionLocal)):
    db_rma = RMA(product_id=rma.product_id, reason=rma.reason)
    db.add(db_rma)
    db.commit()
    db.refresh(db_rma)
    return db_rma
