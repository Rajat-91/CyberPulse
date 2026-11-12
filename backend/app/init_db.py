
from backend.app.database import engine, Base
from backend.app import models

def initialize_database():
    Base.metadata.create_all(bind=engine)
    print("CyberPulse database tables created successfully.")

if __name__ == "__main__":
    initialize_database()
