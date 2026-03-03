function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      
      {/* Header */}
      <header>
        <h1>🌿 MindNest</h1>
        <p>Your thoughts. Your space.</p>
      </header>

      {/* Search Bar */}
      <section style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search thoughts..."
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px"
          }}
        />
      </section>

      {/* Add Note Placeholder */}
      <section style={{ marginTop: "20px" }}>
        <h3>Add New Thought</h3>
        <button>Add Note</button>
      </section>

      {/* Notes Area */}
      <section style={{ marginTop: "20px" }}>
        <h3>Your Notes</h3>

        <div>
          <p>No notes yet.</p>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;