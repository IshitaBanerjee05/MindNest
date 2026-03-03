import { useState } from "react";
import NoteCard from "../components/NoteCard";

function Dashboard() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Struggled with React Routing",
      content: "Today I learned how BrowserRouter wraps the App component.",
      category: "Study",
      emotion: "Motivated",
      tags: ["React", "Routing", "Learning"]
    },
    {
      id: 2,
      title: "Internship Interview Reflection",
      content: "Need to improve DSA confidence.",
      category: "Career",
      emotion: "Determined",
      tags: ["Internship", "DSA"]
    }
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Study");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  function handleAddNote() {
    if (!title || !content) {
      alert("Please fill in title and content!");
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      category,
      tags: tags.split(",").map(t => t.trim()).filter(t => t !== "")
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    setCategory("Study");
    setTags("");
  }

  // Filter logic
 const filteredNotes = notes.filter(note => {
  const searchLower = search.toLowerCase();

  const matchesSearch =
    note.title.toLowerCase().includes(searchLower) ||
    note.content.toLowerCase().includes(searchLower) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchLower));

  const matchesCategory =
    filterCategory === "All" || note.category === filterCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "30px 20px" }}>

      {/* Header */}
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ color: "#2e7d32", margin: 0 }}>🌿 MindNest</h1>
        <p style={{ color: "#777", marginTop: "4px" }}>Your thoughts. Your space.</p>
      </header>

      {/* Search + Filter Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search thoughts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px"
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px"
          }}
        >
          <option value="All">All</option>
          <option value="Study">Study</option>
          <option value="Career">Career</option>
          <option value="Personal">Personal</option>
          <option value="Ideas">Ideas</option>
        </select>
      </div>

      {/* Add Note Form */}
      <div style={{
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        marginBottom: "30px"
      }}>
        <h3 style={{ marginTop: 0, color: "#333" }}>Add New Thought</h3>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box",
            resize: "vertical"
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        >
          <option value="Study">Study</option>
          <option value="Career">Career</option>
          <option value="Personal">Personal</option>
          <option value="Ideas">Ideas</option>
        </select>

        <input
          type="text"
          placeholder="Tags (comma separated, e.g. react, learning)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        <button
          onClick={handleAddNote}
          style={{
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          + Add Note
        </button>
      </div>

      {/* Notes List */}
      <h3 style={{ color: "#333" }}>Your Notes ({filteredNotes.length})</h3>

      {filteredNotes.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center", marginTop: "40px" }}>
          No notes found. Try a different search or add a new one!
        </p>
      ) : (
        filteredNotes.map(note => (
          <NoteCard
            key={note.id}
            title={note.title}
            content={note.content}
            category={note.category}
            emotion={note.emotion}
            tags={note.tags}
          />
        ))
      )}

    </div>
  );
}

export default Dashboard;