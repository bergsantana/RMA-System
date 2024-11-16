from datetime import date
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class LoginDTO(BaseModel):
    email: str
    password: str

class UserInDB(UserCreate):
    hashed_password: str
    role: str

class Token(BaseModel):
    access_token: str
    token_type: str
    

class ProductCreate(BaseModel):
    name: str
    price: float
    

class RMACreate(BaseModel): 
    product_id: int
    employee_id: int
    details: str
    reason: str
    date: str  
    status: str
     
class RMAStep(BaseModel):
    product_id: int 
    rma_id: int 
    status: str
    date: date

class PeriodSearch(BaseModel):
    start_date: str
    end_date: str
