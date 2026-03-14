function NoteCard({ title, content, tags, category, emotion, onEdit, onDelete }) {
    return (
        <div className="note-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.25rem", color: "var(--text-main)" }}>{title}</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                    {onEdit && (
                        <button 
                            onClick={onEdit}
                            style={{ 
                                background: "none", border: "none", color: "var(--text-muted)", 
                                cursor: "pointer", fontSize: "14px", padding: "4px", display: "flex", alignItems: "center", gap: "4px"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    )}
                    {onDelete && (
                        <button 
                            onClick={onDelete}
                            style={{ 
                                background: "none", border: "none", color: "var(--text-muted)", 
                                cursor: "pointer", fontSize: "14px", padding: "4px", display: "flex", alignItems: "center", gap: "4px"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    )}
                </div>
            </div>

            <p style={{ marginTop: 0, color: "var(--text-muted)", lineHeight: "1.6" }}>{content}</p>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
                <div style={{ 
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "4px 10px", backgroundColor: "#f1f5f9", borderRadius: "20px", 
                    fontSize: "13px", color: "var(--text-muted)", fontWeight: "500"
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {category}
                </div>

                {tags && tags.length > 0 && tags.map((tag, index) => (
                    <span
                        key={index}
                        style={{
                            padding: "4px 10px",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "var(--primary)",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "500"
                        }}
                    >
                        #{tag}
                    </span>
                ))}
            </div>

        </div>
    );
}

export default NoteCard;