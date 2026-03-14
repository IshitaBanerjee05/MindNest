import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoteCard from "../components/NoteCard";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/notes", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Study");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  async function handleAddNote() {
    if (!title || !content) {
      setError("Please fill in title and content!");
      return;
    }

    try {
      setIsAdding(true);
      setError("");
      
      const token = localStorage.getItem("token");
      const noteData = {
        title,
        content,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(t => t !== "")
      };
      
      if (editingNoteId) {
        // Update existing note
        const res = await axios.put(`http://localhost:5000/api/notes/${editingNoteId}`, noteData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update the list with the modified note
        setNotes(notes.map(n => n._id === editingNoteId ? res.data : n));
        setEditingNoteId(null);
      } else {
        // Create new note
        const res = await axios.post("http://localhost:5000/api/notes", noteData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Add the new note to the top of the list
        setNotes([res.data, ...notes]);
      }
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("Study");
      setTags("");
    } catch (err) {
      console.error("Error saving note:", err);
      setError("Failed to save note. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  function handleEditClick(note) {
    setEditingNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTags(note.tags ? note.tags.join(", ") : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteClick(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from list
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note. Please try again.");
    }
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
    <div className="layout-container">

      {/* Header */}
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ color: "var(--primary)", margin: "0 0 8px 0", fontSize: "2.5rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
          <span style={{ fontSize: "2.2rem", marginRight: "8px" }}>🌿</span>
          MindNest
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.1rem" }}>Your thoughts. Your space.</p>
      </header>

      {/* Search + Filter Bar */}
      <div className="search-filter-bar">
        <div style={{ position: "relative", flex: 1 }}>
          <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Search thoughts, tags, content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              boxShadow: "var(--shadow-sm)"
            }}
          />
        </div>
        <div style={{ position: "relative", minWidth: "140px" }}>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 36px 12px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              appearance: "none",
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
              color: "var(--text-main)"
            }}
          >
            <option value="All">All Categories</option>
            <option value="Study">Study</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
          </select>
          <svg style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      {/* Add Note Form */}
      <div 
        className="form-container"
        style={{ border: editingNoteId ? "2px solid var(--primary)" : "1px solid var(--border)" }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "24px", color: "var(--text-main)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
          {editingNoteId ? (
            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit Thought</>
          ) : (
            <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add New Thought</>
          )}
          {editingNoteId && (
            <button 
              onClick={() => {
                setEditingNoteId(null);
                setTitle(""); setContent(""); setCategory("Study"); setTags("");
              }}
              style={{ float: "right", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "14px" }}
            >
              Cancel Edit
            </button>
          )}
        </h3>

        {/* Error Message */}
        {error && (
          <div style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Title of your thought..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        <textarea
          placeholder="What's on your mind today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "15px",
            boxSizing: "border-box",
            resize: "vertical",
            lineHeight: "1.6"
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
          disabled={isAdding}
          style={{
            backgroundColor: isAdding ? "var(--border)" : "var(--primary)",
            color: isAdding ? "var(--text-muted)" : "white",
            border: "none",
            padding: "14px 24px",
            borderRadius: "var(--radius-md)",
            fontSize: "15px",
            fontWeight: "600",
            cursor: isAdding ? "not-allowed" : "pointer",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            boxShadow: isAdding ? "none" : "var(--shadow-sm)"
          }}
        >
          {isAdding ? (
            <svg style={{ animation: "logo-spin 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line></svg>
          ) : (
             editingNoteId ? null : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          )}
          {isAdding ? (editingNoteId ? "Updating..." : "Adding...") : (editingNoteId ? "Update Note" : "Add Note")}
        </button>
      </div>

      {/* Notes List */}
      <h3 style={{ color: "var(--text-main)", fontSize: "1.25rem", marginBottom: "24px" }}>
        Your Notes {notes.length > 0 ? `(${filteredNotes.length})` : ""}
      </h3>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", backgroundColor: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)" }}>
          <svg style={{ animation: "logo-spin 1s linear infinite", marginBottom: "16px" }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line></svg>
          <p style={{ margin: 0, fontWeight: "500", fontSize: "1.05rem" }}>Loading your thoughts...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.05rem", fontWeight: "500" }}>
            {notes.length === 0 ? "You haven't added any notes yet. Create your first thought above!" : "No notes found matching your search. Try adjusting your filters."}
          </p>
        </div>
      ) : (
        filteredNotes.map(note => (
          <NoteCard
            key={note._id}
            title={note.title}
            content={note.content}
            category={note.category}
            emotion={note.emotion}
            tags={note.tags}
            onEdit={() => handleEditClick(note)}
            onDelete={() => handleDeleteClick(note._id)}
          />
        ))
      )}

    </div>
  );
}

export default Dashboard;