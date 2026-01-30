function BoardCard({ board, onOpen }) {
  return (
    <div
      onClick={() => onOpen(board)}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      <h4>{board.title}</h4>
      <small>Click to view tasks</small>
    </div>
  );
}

export default BoardCard;
