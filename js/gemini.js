/**
 * Gemini AI Integration
 * Uses Google's Generative AI API for intelligent responses
 */

const GeminiAI = {
    // Configuration
    config: {
        apiKey: null,
        model: 'gemini-1.5-flash',
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
        systemPrompt: `You are ShopAssist AI, a friendly and helpful customer support chatbot for an e-commerce store.

Your personality:
- Warm, professional, and helpful
- Enthusiastic about helping customers find products
- Concise but thorough in your answers

Your knowledge base:
- Shipping: Free for orders over $50. Standard (3-5 days) is $5. Express (1-2 days) is $15.
- Returns: 30-day return policy for unused items in original packaging.
- Payments: We accept Visa, Mastercard, AMEX, PayPal, and Apple Pay.
- Hours: Mon-Fri 9am-6pm EST.

Guidelines:
1. Always stay in character as ShopAssist AI.
2. If you don't know the answer, offer to connect them with a human agent.
3. Keep responses relatively short (under 3 sentences when possible).
4. Use formatting like bullet points for clarity when listing options.`
    },

    // Conversation history to maintain context
    conversationHistory: [],

    /**
     * Initialize Gemini AI with API key
     */
    init(apiKey = null) {
        if (apiKey) {
            this.config.apiKey = apiKey;
            localStorage.setItem('gemini_api_key', apiKey);
            return true;
        }

        // Try to load from localStorage
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            this.config.apiKey = savedKey;
            return true;
        }

        return false;
    },

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return !!this.config.apiKey;
    },

    /**
     * Clear API key
     */
    clearApiKey() {
        this.config.apiKey = null;
        localStorage.removeItem('gemini_api_key');
    },

    /**
     * Send message to Gemini API with sequential model failover
     */
    async sendMessage(userMessage, retryCount = 0) {
        if (!this.config.apiKey) {
            return {
                success: false,
                error: 'API key not configured',
                fallback: true
            };
        }

        // List of models to try in sequence for maximum compatibility
        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-pro'
        ];

        const activeModel = modelsToTry[retryCount] || modelsToTry[0];

        // Add user message to history only if not a retry
        if (retryCount === 0) {
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Keep conversation history manageable
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }
        }

        try {
            console.log(`📡 Sending to Gemini (${activeModel}) via v1beta...`);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${this.config.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: this.config.systemPrompt }]
                            },
                            {
                                role: 'model',
                                parts: [{ text: 'I understand. I am ShopAssist AI. How can I help you today?' }]
                            },
                            ...this.conversationHistory
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 800
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error?.message || 'Unknown error';
                console.error(`Gemini API error (${activeModel}):`, errorData);

                // Self-healing: If model not found and we have more models to try
                if (retryCount < modelsToTry.length - 1 &&
                    (errorMessage.includes('not found') || errorMessage.includes('supported') || errorMessage.includes('not available'))) {
                    console.log(`🔄 Model ${activeModel} failed. Retrying with ${modelsToTry[retryCount + 1]}...`);
                    return await this.sendMessage(userMessage, retryCount + 1);
                }

                if (response.status === 400 && errorMessage.includes('API key')) {
                    return {
                        success: false,
                        error: 'Invalid API key. Please check your settings.',
                        fallback: true
                    };
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Extract response text
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!responseText) {
                throw new Error('No response generated');
            }

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: responseText }]
            });

            return {
                success: true,
                text: responseText,
                source: 'gemini'
            };

        } catch (error) {
            console.error(`Gemini connectivity error (${activeModel}):`, error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    },

    /**
     * Get smart response with fallback
     */
    async getResponse(message) {
        // First check knowledge base for high-confidence matches
        const kbResponse = KnowledgeBase.processMessage(message);

        // If knowledge base has a good answer (not the generic fallback), use it
        if (kbResponse.confidence !== 'low') {
            console.log('📚 KnowledgeBase matched with high confidence:', kbResponse.intent);
            return {
                text: kbResponse.text,
                source: 'knowledge_base',
                followUp: kbResponse.followUp
            };
        }

        // Try Gemini for questions the knowledge base can't handle
        if (this.isConfigured()) {
            console.log('📡 Trying Gemini (v1beta)...');
            const geminiResponse = await this.sendMessage(message);

            if (geminiResponse.success) {
                return {
                    text: geminiResponse.text,
                    source: 'gemini',
                    followUp: this.generateFollowUp(message)
                };
            } else if (!geminiResponse.fallback) {
                // If it's a real API error (not just unconfigured)
                return {
                    text: `⚠️ **AI Bot Issue**\n\nI tried asking Gemini to help with this, but it ran into an error: *"${geminiResponse.error}"*\n\nCheck your API key in settings (⚙️) or stick with my basic assistant for now!`,
                    source: 'error',
                    followUp: ['Check settings', 'Return to home']
                };
            }
        }

        // Use knowledge base fallback
        console.log('🔄 Using KB fallback');
        return {
            text: kbResponse.text,
            source: 'knowledge_base',
            followUp: kbResponse.followUp
        };
    },

    /**
     * Generate smart follow-up questions
     */
    generateFollowUp(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buy')) {
            return ['How to order', 'Payment methods', 'Shipping info'];
        }

        if (lowerMessage.includes('return') || lowerMessage.includes('broken') || lowerMessage.includes('wrong')) {
            return ['Return policy', 'Talk to human', 'Track my order'];
        }

        return ['What else can you do?', 'Help with products', 'Shipping info'];
    },

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        ChatUI.addBotMessage('Chat history cleared. How else can I help you?');
    }
};

// Export for use in other modules
window.GeminiAI = GeminiAI;
