// Validated that this matches the original TS logic, just removing types.
const store = new Map();

export function getConversation(sessionId) {
    const conversation = store.get(sessionId);
    if (!conversation) return [];
    return conversation.messages;
}

export function saveConversation(sessionId, messages) {
    store.set(sessionId, {
        messages,
        updatedAt: Date.now(),
    });
}

// Optional: cleanup old sessions
setInterval(() => {
    const now = Date.now();
    for (const [id, conversation] of store.entries()) {
        if (now - conversation.updatedAt > 3600 * 1000) { // 1 hour expiration
            store.delete(id);
        }
    }
}, 60 * 60 * 1000);
