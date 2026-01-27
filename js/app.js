/**
 * ShopAssist AI - Main Application
 * Coordinates all modules and handles user interactions
 */

const App = {
    // Application state
    state: {
        isProcessing: false,
        messageCount: 0,
        useGemini: false
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('🤖 ShopAssist AI initializing...');

        // Initialize modules
        ThemeSwitcher.init();
        ChatUI.init();
        VoiceInput.init();

        // Initialize Gemini AI
        const hasApiKey = GeminiAI.init();
        this.state.useGemini = hasApiKey;

        // Bind event listeners
        this.bindEvents();

        // Show API key modal if not configured
        if (!hasApiKey) {
            this.showApiKeyModal();
        }

        console.log('✅ ShopAssist AI ready!');
        console.log(`🧠 AI Mode: ${hasApiKey ? 'Gemini' : 'Demo (Knowledge Base)'}`);
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
                GeminiAI.clearHistory();
            }
        });

        // API Key Modal
        document.getElementById('saveApiKey').addEventListener('click', () => {
            this.saveApiKey();
        });

        document.getElementById('skipApiKey').addEventListener('click', () => {
            this.hideApiKeyModal();
        });

        // API key input enter key
        document.getElementById('apiKeyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });

        // Focus input on load
        ChatUI.focusInput();
    },

    /**
     * Show API key modal
     */
    showApiKeyModal() {
        const modal = document.getElementById('apiKeyModal');
        modal.classList.add('active');
    },

    /**
     * Hide API key modal
     */
    hideApiKeyModal() {
        const modal = document.getElementById('apiKeyModal');
        modal.classList.remove('active');
        ChatUI.focusInput();
    },

    /**
     * Save API key from modal
     */
    saveApiKey() {
        const input = document.getElementById('apiKeyInput');
        const apiKey = input.value.trim();

        if (!apiKey) {
            alert('Please enter an API key or click "Skip" to use demo mode.');
            return;
        }

        // Validate key format (basic check)
        if (!apiKey.startsWith('AIza')) {
            alert('Invalid API key format. Gemini API keys start with "AIza".');
            return;
        }

        // Save and initialize
        GeminiAI.init(apiKey);
        this.state.useGemini = true;
        this.hideApiKeyModal();

        // Add confirmation message
        ChatUI.addBotMessage(
            '✅ **Gemini AI Connected!**\n\nI\'m now powered by Google\'s Gemini AI for more intelligent and natural conversations. Go ahead, ask me anything!',
            ['What can you help with?', 'Tell me about your features', 'Track my order']
        );

        console.log('🧠 Gemini AI connected');
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

        // Calculate delay (realistic typing time)
        const delay = this.calculateDelay();
        await this.sleep(delay);

        try {
            let response;

            // Use Gemini if configured, otherwise use knowledge base
            if (this.state.useGemini && GeminiAI.isConfigured()) {
                response = await GeminiAI.getResponse(message);
            } else {
                // Use knowledge base
                const kbResponse = KnowledgeBase.processMessage(message);
                response = {
                    text: kbResponse.text,
                    source: 'knowledge_base',
                    followUp: kbResponse.followUp
                };
            }

            // Hide typing
            ChatUI.hideTyping();

            // Add bot response
            ChatUI.addBotMessage(response.text, response.followUp);

            // Log source
            console.log(`📝 Response source: ${response.source}`);

        } catch (error) {
            console.error('Error processing message:', error);

            ChatUI.hideTyping();
            ChatUI.addBotMessage(
                `I apologize, but I encountered an issue. Please try again.\n\n💡 **Tip:** If this persists, try refreshing the page.`,
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
    calculateDelay() {
        // Gemini needs a bit more time
        const baseDelay = this.state.useGemini ? 500 : 800;
        const variableDelay = Math.random() * 800;
        return baseDelay + variableDelay;
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
