from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, text
from sqlalchemy.orm import relationship
from database import Base

class RMASTEP(Base):
    __tablename__ = "rmasteps"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    rma_id = Column(Integer, ForeignKey('rmas.id'))
    status = Column(String, default="Pending")
    date = Column(DateTime, default=text('CURRENT_TIMESTAMP'))
    product = relationship("Product")
    rma = relationship("RMA")