from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

todo_bp = Blueprint("todos", __name__, url_prefix="/api/todos")


# Add task to a board

@todo_bp.route("", methods=["POST"])
@jwt_required()
def add_todo():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request body"}), 400

    title = data.get("title")
    board_id = data.get("board_id")

    if not title or not board_id:
        return jsonify({"error": "title and board_id required"}), 400

    try:
        board_object_id = ObjectId(board_id)
    except InvalidId:
        return jsonify({"error": "Invalid board id"}), 400

    db = get_db()

    board = db.boards.find_one({
        "_id": board_object_id,
        "user_id": user_id
    })

    if not board:
        return jsonify({"error": "Board not found"}), 404

    todo = {
        "title": title,
        "board_id": board_id,
        "user_id": user_id,
        "done": False,
        "created_at": datetime.utcnow()
    }

    db.todos.insert_one(todo)

    return jsonify({"message": "Todo added successfully"}), 201


# ===============================
# Get todos of a board
# ===============================
@todo_bp.route("/<board_id>", methods=["GET"])
@jwt_required()
def get_todos(board_id):
    user_id = get_jwt_identity()
    db = get_db()

    todos = list(db.todos.find({
        "board_id": board_id,
        "user_id": user_id
    }))

    for t in todos:
        t["_id"] = str(t["_id"])

    return jsonify(todos), 200


# ===============================
# Toggle todo done / undone
# ===============================
@todo_bp.route("/toggle/<todo_id>", methods=["POST"])
@jwt_required()
def toggle_todo(todo_id):
    user_id = get_jwt_identity()
    db = get_db()

    try:
        todo_object_id = ObjectId(todo_id)
    except InvalidId:
        return jsonify({"error": "Invalid todo id"}), 400

    todo = db.todos.find_one({
        "_id": todo_object_id,
        "user_id": user_id
    })

    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    new_status = not todo.get("done", False)

    db.todos.update_one(
        {"_id": todo_object_id},
        {"$set": {"done": new_status}}
    )

    return jsonify({
        "message": "Todo updated",
        "done": new_status
    }), 200
@todo_bp.route("/<todo_id>", methods=["DELETE"])
@jwt_required()
def delete_todo(todo_id):
    user_id = get_jwt_identity()
    db = get_db()

    try:
        todo_object_id = ObjectId(todo_id)
    except:
        return jsonify({"error": "Invalid todo id"}), 400

    result = db.todos.delete_one({
        "_id": todo_object_id,
        "user_id": user_id
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Todo not found"}), 404

    return jsonify({"message": "Todo deleted successfully"}), 200
@todo_bp.route("/<todo_id>", methods=["PATCH"])
@jwt_required()
def update_todo(todo_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    new_title = data.get("title")
    if not new_title:
        return jsonify({"error": "Title required"}), 400

    db = get_db()
    result = db.todos.update_one(
        {"_id": ObjectId(todo_id), "user_id": user_id},
        {"$set": {"title": new_title}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Todo not found"}), 404

    return jsonify({"message": "Todo updated"}), 200

