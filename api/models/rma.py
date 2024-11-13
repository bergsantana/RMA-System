from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class RMA(Base):
    __tablename__ = "rmas"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    reason = Column(String)
    status = Column(String, default="Pending")
    product = relationship("Product")