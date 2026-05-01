import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoteCard from "../components/NoteCard";

const REFLECTION_PROMPTS = [
  "What is one thing you learned today?",
  "What made you smile today?",
  "Describe a challenge you faced and how you handled it.",
  "What are you most grateful for right now?",
  "What's one goal you want to focus on tomorrow?",
  "How are you feeling emotionally, and why?",
  "Write about a small win you had today."
];

function Dashboard() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("mindnest_notes");
    return saved ? JSON.parse(saved) : [];
  });
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
  const [emotion, setEmotion] = useState("Neutral");
  const [tags, setTags] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Theme logic
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Persist notes to localStorage
  useEffect(() => {
    localStorage.setItem("mindnest_notes", JSON.stringify(notes));
  }, [notes]);

  // Expose search filter globally for tag chips
  useEffect(() => {
    window.setSearchFilter = (tag) => {
      setSearch(tag);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return () => delete window.setSearchFilter;
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
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
        emotion,
        tags: tags.split(",").map(t => t.trim()).filter(t => t !== ""),
        deadline: deadline || null
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
      setEmotion("Neutral");
      setTags("");
      setDeadline("");

      // Provide success feedback
      setSuccessMsg(editingNoteId ? "Thought updated successfully!" : "Thought safely added to your nest!");
      setTimeout(() => setSuccessMsg(""), 3000);
      if (!editingNoteId) window.scrollTo({ top: 0, behavior: "smooth" });
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
    setEmotion(note.emotion || "Neutral");
    setTags(note.tags ? note.tags.join(", ") : "");
    setDeadline(note.deadline ? new Date(note.deadline).toISOString().split("T")[0] : "");
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
      <header style={{ marginBottom: "56px", position: "relative", textAlign: "center" }}>
        <button 
           onClick={() => setTheme(theme === "light" ? "dark" : "light")}
           style={{ 
             position: "absolute", right: 0, top: 0, 
             background: "var(--surface)", border: "1px solid var(--border)", 
             borderRadius: "50%", width: "40px", height: "40px", 
             display: "flex", alignItems: "center", justifyContent: "center",
             cursor: "pointer", color: "var(--text-main)", boxShadow: "var(--shadow-sm)"
           }}
           aria-label="Toggle Dark Mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

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
              padding: "16px 16px 16px 48px",
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
              padding: "16px 36px 16px 16px",
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
                setTitle(""); setContent(""); setCategory("Study"); setEmotion("Neutral"); setTags(""); setDeadline("");
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

        {/* Success Message */}
        {successMsg && (
          <div style={{ color: "var(--primary)", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "var(--radius-md)", marginBottom: "20px", border: "1px solid var(--primary)", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {successMsg}
          </div>
        )}

        <input
          type="text"
          placeholder="Title of your thought..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        {!editingNoteId && (
          <div style={{ marginBottom: "8px", fontSize: "13.5px", color: "var(--primary)", fontWeight: "500", display: "flex", gap: "6px", alignItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Prompt: {REFLECTION_PROMPTS[new Date().getDay()]}
          </div>
        )}
        <textarea
          placeholder="Start writing here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "15px",
            boxSizing: "border-box",
            resize: "vertical",
            lineHeight: "1.6"
          }}
        />

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          >
            <option value="Study">📚 Study</option>
            <option value="Career">💼 Career</option>
            <option value="Personal">👤 Personal</option>
            <option value="Ideas">💡 Ideas</option>
          </select>

          <select
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          >
            <option value="Happy">😊 Happy</option>
            <option value="Motivated">🚀 Motivated</option>
            <option value="Neutral">😐 Neutral</option>
            <option value="Stressed">😫 Stressed</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Tags (comma separated, e.g. react, learning)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            fontSize: "15px",
            boxSizing: "border-box"
          }}
        />

        {/* Deadline Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "flex", alignItems: "center", gap: "6px",
            marginBottom: "8px", color: "var(--text-muted)", fontWeight: "500", fontSize: "0.9rem"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Deadline (optional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              boxSizing: "border-box",
              backgroundColor: "var(--background-input)",
              color: "var(--text-main)",
              fontFamily: "'Inter', sans-serif"
            }}
          />
          {deadline && (
            <button
              type="button"
              onClick={() => setDeadline("")}
              style={{
                background: "none", border: "none", color: "var(--text-muted)",
                cursor: "pointer", fontSize: "13px", marginTop: "6px", padding: 0,
                textDecoration: "underline"
              }}
            >
              Remove deadline
            </button>
          )}
        </div>

        <button
          onClick={handleAddNote}
          disabled={isAdding}
          className="btn-primary"
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ color: "var(--text-main)", fontSize: "1.25rem", margin: 0 }}>
          Your Notes {notes.length > 0 ? `(${filteredNotes.length})` : ""}
        </h3>
        {search && (
          <button 
             onClick={() => setSearch("")}
             style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "14px", fontWeight: "500", textDecoration: "underline" }}
          >
            Clear Search
          </button>
        )}
      </div>

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
            date={note.createdAt}
            deadline={note.deadline}
            onEdit={() => handleEditClick(note)}
            onDelete={() => handleDeleteClick(note._id)}
          />
        ))
      )}

    </div>
  );
}

export default Dashboard;