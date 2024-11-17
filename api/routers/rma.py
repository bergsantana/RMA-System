from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import SessionLocal
from models.rma import RMA
from models.rmastep import RMASTEP
from schemas import RMACreate, PeriodSearch
from utils.utils import get_session_local
from datetime import date
from models.rma import RMA
from fastapi.security import OAuth2PasswordBearer
from auth.auth import validate_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


@router.post("/create-many/")
def create_rmas(rmas: list[RMACreate], db: Session = Depends(get_session_local)):
 
    for rma in rmas: 
        this_status = ""
        if rma.status == "Recebido":
            this_status = "Received"
        if rma.status == "Em teste":
            this_status = "Testing"
        if rma.status == "Concluido":
            this_status = "Concluded"

        db_rma = db.query(RMA).filter(RMA.id==rma.product_id).one()
         
        if db_rma.product_id:
            db_rmaStep = RMASTEP( 
                product_id = rma.product_id,
                rma_id = db_rma.id,
                date = date.fromisoformat(rma.date.replace('/', '')),
                status= this_status
            ) 
            db.add(db_rmaStep)
            db.commit()
            db.refresh(db_rmaStep)
        else:
            db_rma = RMA(
                product_id=  rma.product_id,
                employee_id = rma.employee_id,
                reason = rma.reason,
                details = rma.status
            )
            db.add(db_rma)
            db.commit()
            db.refresh(db_rma)
            db_rmaStep = RMASTEP( 
                product_id = rma.product_id,
                rma_id = db_rma.id,
                date = date.fromisoformat(rma.date.replace('/', '')),
                status= this_status
            )   
            db.commit()
            db.refresh(db_rmaStep)
        print("Criado RMA")
        print(f"RMA - id={db_rma.product_id}, employee={db_rma.employee_id}, reason={db_rma.reason}, status - {db_rma.this_status}")


  
    return rmas

@router.post("/create/")
def create_rma(rma: RMACreate, token: str = Depends(oauth2_scheme), db: Session = Depends(get_session_local)):
    validate_token(token, db)
    try:
        db_rma = RMA(product_id=rma.product_id, reason=rma.reason, details=rma.details)
        db.add(db_rma)
        db.commit()
        db.refresh(db_rma)
        db_rmaStep = RMASTEP( 
            product_id = rma.product_id,
            rma_id = db_rma.id,
        )
        db.add(db_rmaStep)
        db.commit()
        db.refresh(db_rmaStep)
    except:
        print("ERRO ao criar RMA")
    return "SUCESS"


@router.post("/find-by-period")
def find_by_period(period: PeriodSearch,  token: str = Depends(oauth2_scheme), db: Session = Depends(get_session_local) ):
    validate_token(token, db)
    start_date = date.fromisoformat(period.start_date.replace('/', ''))
    end_date = date.fromisoformat(period.end_date.replace('/', ''))

    db_rma = db.query(RMASTEP).filter(RMASTEP.date.between(start_date, end_date)).all()

    return db_rma

