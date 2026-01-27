/**
 * ShopAssist AI - Main Application
 * Coordinates all modules and handles user interactions
 */

const App = {
    // Application state
    state: {
        isProcessing: false,
        messageCount: 0
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('🤖 ShopAssist AI initializing...');

        // Initialize UI
        ChatUI.init();

        // Bind event listeners
        this.bindEvents();

        // Ready
        console.log('✅ ShopAssist AI ready!');
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Send button click
        ChatUI.elements.sendBtn.addEventListener('click', () => this.handleSend());

        // Enter key to send
        ChatUI.elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Quick reply buttons (event delegation)
        ChatUI.elements.quickReplies.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                const message = e.target.dataset.message;
                this.processMessage(message);
            }
        });

        // Also handle dynamically added quick replies in chat
        ChatUI.elements.chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                const message = e.target.dataset.message;
                this.processMessage(message);
            }
        });

        // Clear chat button
        ChatUI.elements.clearBtn.addEventListener('click', () => {
            if (confirm('Clear chat history?')) {
                ChatUI.clearChat();
            }
        });

        // Focus input on load
        ChatUI.focusInput();
    },

    /**
     * Handle send button click
     */
    async handleSend() {
        const message = ChatUI.getInputValue();

        if (!message || this.state.isProcessing) {
            return;
        }

        await this.processMessage(message);
    },

    /**
     * Process a message (from input or quick reply)
     */
    async processMessage(message) {
        if (this.state.isProcessing) return;

        this.state.isProcessing = true;
        this.state.messageCount++;

        // Add user message to chat
        ChatUI.addUserMessage(message);

        // Disable input while processing
        ChatUI.setInputEnabled(false);

        // Show typing indicator
        ChatUI.showTyping();

        // Simulate realistic response delay
        const delay = this.calculateDelay(message);
        await this.sleep(delay);

        try {
            // Get smart response (AI + Knowledge Base hybrid)
            const response = await AIService.getSmartResponse(message);

            // Hide typing
            ChatUI.hideTyping();

            // Add bot response
            ChatUI.addBotMessage(response.text, response.followUp);

            // Log for debugging
            console.log(`📝 Response source: ${response.source}, Intent: ${response.intent}`);

        } catch (error) {
            console.error('Error processing message:', error);

            ChatUI.hideTyping();
            ChatUI.addBotMessage(
                `I apologize, but I encountered an issue. Please try again or contact our support team.\n\n📞 Support: 1-800-SHOP-HELP\n📧 Email: support@shopassist.com`,
                ['Try again', 'Contact support']
            );
        }

        // Re-enable input
        ChatUI.setInputEnabled(true);
        ChatUI.focusInput();
        this.state.isProcessing = false;
    },

    /**
     * Calculate realistic typing delay
     */
    calculateDelay(message) {
        // Base delay + variable based on expected response length
        const baseDelay = 800;
        const variableDelay = Math.random() * 1000;

        // Longer messages might need more "thinking" time
        const thinkingTime = Math.min(message.length * 20, 1000);

        return baseDelay + variableDelay + thinkingTime;
    },

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging
window.App = App;
