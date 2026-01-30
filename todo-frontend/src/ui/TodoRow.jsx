function TodoRow({ task, onToggle, onDelete,onEdit }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task._id)}
      />

      <span
        style={{
          flex: 1,
          textDecoration: task.done ? "line-through" : "none",
        }}
      >
        {task.title}
      </span>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
      <button onClick={() => onDelete(task._id)}>❌</button>
    </div>
  );
}

export default TodoRow;
