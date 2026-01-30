from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db
from datetime import datetime
from bson import ObjectId          # ✅ MUST
from bson.errors import InvalidId  # ✅ MUST

board_bp = Blueprint("boards", __name__, url_prefix="/api/boards")

# ======================
# CREATE BOARD
# ======================
@board_bp.route("", methods=["POST"])
@jwt_required()
def create_board():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Board title required"}), 400

    db = get_db()
    db.boards.insert_one({
        "title": data["title"],
        "user_id": user_id,
        "created_at": datetime.utcnow()
    })

    return jsonify({"message": "Board created"}), 201


# ======================
# GET BOARDS
# ======================
@board_bp.route("", methods=["GET"])
@jwt_required()
def get_boards():
    user_id = get_jwt_identity()
    db = get_db()

    boards = list(db.boards.find({"user_id": user_id}, {"user_id": 0}))
    for b in boards:
        b["_id"] = str(b["_id"])

    return jsonify(boards), 200


# ======================
# UPDATE BOARD (RENAME)
# ======================
@board_bp.route("/<board_id>", methods=["PATCH"])
@jwt_required()
def update_board(board_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Title required"}), 400

    db = get_db()

    try:
        board_object_id = ObjectId(board_id)
    except InvalidId:
        return jsonify({"error": "Invalid board id"}), 400

    result = db.boards.update_one(
        {"_id": board_object_id, "user_id": user_id},
        {"$set": {"title": data["title"]}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Board not found"}), 404

    return jsonify({"message": "Board updated"}), 200


# ======================
# DELETE BOARD
# ======================
@board_bp.route("/<board_id>", methods=["DELETE"])
@jwt_required()
def delete_board(board_id):
    user_id = get_jwt_identity()
    db = get_db()

    try:
        board_object_id = ObjectId(board_id)
    except InvalidId:
        return jsonify({"error": "Invalid board id"}), 400

    board = db.boards.find_one({
        "_id": board_object_id,
        "user_id": user_id
    })

    if not board:
        return jsonify({"error": "Board not found"}), 404

    db.todos.delete_many({"board_id": board_id})
    db.boards.delete_one({"_id": board_object_id})

    return jsonify({"message": "Board deleted"}), 200
