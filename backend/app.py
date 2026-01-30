from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import get_db
from auth.auth_routes import auth_bp
from boards.board_routes import board_bp
from todos.todo_routes import todo_bp

app = Flask(__name__)
app.config.from_object(Config)

# ✅ Enable CORS (SIMPLE & SAFE)
CORS(app)

# ✅ JWT
jwt = JWTManager(app)

# ✅ Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(board_bp)
app.register_blueprint(todo_bp)

@app.route("/")
def health_check():
    return {"status": "Backend is running"}

@app.route("/db-check")
def db_check():
    db = get_db()
    db.test.insert_one({"check": "ok"})
    return {"message": "Database connected"}

if __name__ == "__main__":
    app.run(debug=True)
