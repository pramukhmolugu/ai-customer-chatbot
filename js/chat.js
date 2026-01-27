/**
 * Chat UI Handler
 * Manages message display, animations, and user interactions
 */

const ChatUI = {
    // DOM elements
    elements: {
        chatMessages: null,
        messageInput: null,
        sendBtn: null,
        typingIndicator: null,
        quickReplies: null,
        clearBtn: null
    },

    // State
    isTyping: false,

    /**
     * Initialize chat UI
     */
    init() {
        // Cache DOM elements
        this.elements.chatMessages = document.getElementById('chatMessages');
        this.elements.messageInput = document.getElementById('messageInput');
        this.elements.sendBtn = document.getElementById('sendBtn');
        this.elements.typingIndicator = document.getElementById('typingIndicator');
        this.elements.quickReplies = document.getElementById('quickReplies');
        this.elements.clearBtn = document.getElementById('clearChat');

        // Load chat history from localStorage
        this.loadHistory();
    },

    /**
     * Add user message to chat
     */
    addUserMessage(text) {
        const messageHtml = `
            <div class="message user-message">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${this.escapeHtml(text)}</p>
                    </div>
                    <span class="message-time">${this.getTimeStamp()}</span>
                </div>
            </div>
        `;

        this.elements.chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
        this.hideQuickReplies();
        this.saveHistory();
    },

    /**
     * Add bot message to chat
     */
    addBotMessage(text, followUp = []) {
        // Parse markdown-like formatting
        const formattedText = this.formatMessage(text);

        const messageHtml = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        ${formattedText}
                    </div>
                    <span class="message-time">${this.getTimeStamp()}</span>
                </div>
            </div>
        `;

        this.elements.chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();

        // Show follow-up quick replies if provided
        if (followUp && followUp.length > 0) {
            this.showQuickReplies(followUp);
        }

        this.saveHistory();
    },

    /**
     * Format message text (simple markdown parsing)
     */
    formatMessage(text) {
        return text
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Line breaks
            .replace(/\n/g, '<br>')
            // Lists (• bullet points)
            .replace(/^• (.+)$/gm, '<li>$1</li>')
            // Wrap lists
            .replace(/(<li>.*<\/li>\s*)+/g, '<ul>$&</ul>')
            // Paragraphs
            .split('<br><br>')
            .map(p => `<p>${p}</p>`)
            .join('');
    },

    /**
     * Show typing indicator
     */
    showTyping() {
        this.isTyping = true;
        this.elements.typingIndicator.classList.add('active');
        this.scrollToBottom();
    },

    /**
     * Hide typing indicator
     */
    hideTyping() {
        this.isTyping = false;
        this.elements.typingIndicator.classList.remove('active');
    },

    /**
     * Show quick reply buttons
     */
    showQuickReplies(options) {
        this.elements.quickReplies.innerHTML = options
            .map(opt => `<button class="quick-reply-btn" data-message="${this.escapeHtml(opt)}">${opt}</button>`)
            .join('');
        this.elements.quickReplies.style.display = 'flex';
        this.scrollToBottom();
    },

    /**
     * Hide quick replies
     */
    hideQuickReplies() {
        this.elements.quickReplies.style.display = 'none';
    },

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        }, 100);
    },

    /**
     * Get current timestamp
     */
    getTimeStamp() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Clear chat history
     */
    clearChat() {
        const welcomeMessage = this.elements.chatMessages.querySelector('.bot-message');
        this.elements.chatMessages.innerHTML = '';
        if (welcomeMessage) {
            this.elements.chatMessages.appendChild(welcomeMessage.cloneNode(true));
        }
        this.showQuickReplies([
            '📦 Track my order',
            '🔄 Return an item',
            '💳 Payment options',
            '🛍️ Recommendations'
        ]);
        localStorage.removeItem('chatHistory');
        AIService.clearHistory();
    },

    /**
     * Save chat to localStorage
     */
    saveHistory() {
        const messages = this.elements.chatMessages.innerHTML;
        localStorage.setItem('chatHistory', messages);
    },

    /**
     * Load chat from localStorage
     */
    loadHistory() {
        const history = localStorage.getItem('chatHistory');
        if (history) {
            this.elements.chatMessages.innerHTML = history;
            this.scrollToBottom();
        }
    },

    /**
     * Get input value and clear
     */
    getInputValue() {
        const value = this.elements.messageInput.value.trim();
        this.elements.messageInput.value = '';
        return value;
    },

    /**
     * Focus input
     */
    focusInput() {
        this.elements.messageInput.focus();
    },

    /**
     * Disable/enable input
     */
    setInputEnabled(enabled) {
        this.elements.messageInput.disabled = !enabled;
        this.elements.sendBtn.disabled = !enabled;
    }
};

// Export for use in other modules
window.ChatUI = ChatUI;
