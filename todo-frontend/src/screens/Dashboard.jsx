import { useEffect, useState } from "react";
import BoardCard from "../ui/BoardCard";
import TodoRow from "../ui/TodoRow";
import { apiRequest } from "../services/api";

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [todos, setTodos] = useState([]);

  const [boardName, setBoardName] = useState("");
  const [newTask, setNewTask] = useState("");

  // ======================
  // Fetch boards
  // ======================
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const data = await apiRequest("/api/boards");
    setBoards(data || []);
  };

  // ======================
  // Create board
  // ======================
  const addBoard = async () => {
    if (!boardName.trim()) return;

    await apiRequest("/api/boards", "POST", { title: boardName });
    setBoardName("");
    fetchBoards();
  };

  // ======================
  // Open board & load todos
  // ======================
  const openBoard = async (board) => {
    setActiveBoard(board);
    const data = await apiRequest(`/api/todos/${board._id}`);
    setTodos(data || []);
  };

  // ======================
  // Add todo
  // ======================
  const addTask = async () => {
    if (!newTask.trim()) return;

    await apiRequest("/api/todos", "POST", {
      title: newTask,
      board_id: activeBoard._id,
    });

    setNewTask("");
    const data = await apiRequest(`/api/todos/${activeBoard._id}`);
    setTodos(data || []);
  };

  // ======================
  // Toggle todo
  // ======================
  const toggleTask = async (todoId) => {
    await apiRequest(`/api/todos/toggle/${todoId}`, "POST");

    const data = await apiRequest(`/api/todos/${activeBoard._id}`);
    setTodos(data || []);
  };

  // ======================
  // Delete todo
  // ======================
  const deleteTask = async (todoId) => {
    await apiRequest(`/api/todos/${todoId}`, "DELETE");

    const data = await apiRequest(`/api/todos/${activeBoard._id}`);
    setTodos(data || []);
  };

  // ======================
  // Delete board
  // ======================
  const deleteBoard = async (boardId) => {
    if (!window.confirm("Delete this board?")) return;

    await apiRequest(`/api/boards/${boardId}`, "DELETE");
    setActiveBoard(null);
    fetchBoards();
  };
  const renameBoard = async () => {
  const newName = prompt("Enter new board name", activeBoard.title);
  if (!newName) return;

  await apiRequest(`/api/boards/${activeBoard._id}`, "PATCH", {
    title: newName,
  });

  fetchBoards();
  setActiveBoard({ ...activeBoard, title: newName });
};
const editTodo = async (todo) => {
  const newTitle = prompt("Edit task", todo.title);
  if (!newTitle || !newTitle.trim()) return;

  await apiRequest(`/api/todos/${todo._id}`, "PATCH", {
    title: newTitle,
  });

  const data = await apiRequest(`/api/todos/${activeBoard._id}`);
  setTodos(data || []);
};


return (
  <div className="dashboard">
    {/* ===== HEADER ===== */}
    {!activeBoard && (
      <>
        <div className="dashboard-header">
          <h2>Your Boards</h2>

          <div className="create-board">
            <input
              placeholder="New board name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <button onClick={addBoard}>Create</button>
          </div>
        </div>

        <div className="board-grid">
          {boards.map((b) => (
            <BoardCard key={b._id} board={b} onOpen={openBoard} />
          ))}
        </div>
      </>
    )}

    {/* ===== TODOS VIEW ===== */}
    {activeBoard && (
      <>
        <div className="dashboard-header">
          <h2>{activeBoard.title} – Tasks</h2>

          <div className="board-actions">
            <button
              className="delete-board"
              onClick={() => deleteBoard(activeBoard._id)}
            >
              Delete Board
            </button>
            <button onClick={() => setActiveBoard(null)}>Back</button>
            <button onClick={renameBoard}>Rename Board</button>

          </div>
        </div>

        <div className="create-todo">
          <input
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        <div style={{ marginTop: "15px" }}>
  {todos.map((t) => (
    <TodoRow
      key={t._id}
      task={t}
      onToggle={toggleTask}
      onDelete={deleteTask}
      onEdit={editTodo}

    />
  ))}
</div>

      </>
    )}
  </div>
);
}

export default Dashboard;
