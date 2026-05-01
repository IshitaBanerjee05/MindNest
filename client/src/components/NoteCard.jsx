function NoteCard({ title, content, tags, category, emotion, date, deadline, onEdit, onDelete }) {

    // Compute deadline status
    let deadlineLabel = null;
    let deadlineStyle = {};
    if (deadline) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const dl = new Date(deadline);
        dl.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));

        const formatted = dl.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

        if (diffDays < 0) {
            deadlineLabel = `Overdue · ${formatted}`;
            deadlineStyle = { backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
        } else if (diffDays === 0) {
            deadlineLabel = `Due today · ${formatted}`;
            deadlineStyle = { backgroundColor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" };
        } else if (diffDays <= 3) {
            deadlineLabel = `Due in ${diffDays}d · ${formatted}`;
            deadlineStyle = { backgroundColor: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" };
        } else {
            deadlineLabel = `Due ${formatted}`;
            deadlineStyle = { backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" };
        }
    }

    return (
        <div className="note-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.25rem", color: "var(--text-main)" }}>{title}</h3>
                  {date && (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  )}
                </div>
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

            {/* Deadline Badge */}
            {deadlineLabel && (
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "6px 12px", borderRadius: "20px",
                    fontSize: "13px", fontWeight: "600",
                    marginBottom: "12px",
                    ...deadlineStyle
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {deadlineLabel}
                </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: deadlineLabel ? "4px" : "16px", flexWrap: "wrap" }}>
                <div style={{ 
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "4px 10px", backgroundColor: "#fdf8f5", borderRadius: "20px", 
                    fontSize: "13px", color: "#2d1a11", fontWeight: "600", border: "1px solid #e8dccb"
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {category}
                </div>

                {emotion && emotion !== "Neutral" && (
                     <div style={{ 
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        padding: "4px 10px", backgroundColor: "rgba(245, 158, 11, 0.1)", borderRadius: "20px", 
                        fontSize: "13px", color: "#d97706", fontWeight: "500"
                    }}>
                        {emotion === "Happy" && "😊 Happy"}
                        {emotion === "Motivated" && "🚀 Motivated"}
                        {emotion === "Stressed" && "😫 Stressed"}
                    </div>
                )}

                {tags && tags.length > 0 && tags.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (window.setSearchFilter) window.setSearchFilter(tag);
                        }}
                        style={{
                            padding: "4px 10px",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            color: "var(--primary)",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.2)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.1)"}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

        </div>
    );
}

export default NoteCard;