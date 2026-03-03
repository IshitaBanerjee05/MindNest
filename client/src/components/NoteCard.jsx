function NoteCard({ title, content, tags, category, emotion }) {
    return (
        <div style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            backgroundColor: "#f9f9f9",
            color: "#222"   // 👈 ADD THIS
        }}>

            <h3>{title}</h3>

            <p>{content}</p>

            <p><strong>Category:</strong> {category}</p>

            {emotion && (
                <p><strong>Emotion:</strong> {emotion}</p>
            )}

            <div>
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        style={{
                            marginRight: "8px",
                            padding: "4px 8px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "5px",
                            fontSize: "12px"
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