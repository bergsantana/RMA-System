from database import SessionLocal

def get_session_local():
    yield SessionLocal()