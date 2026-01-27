/**
 * Gemini AI Integration
 * Uses Google's Generative AI API for intelligent responses
 */

const GeminiAI = {
    // Configuration
    config: {
        apiKey: null,
        model: 'gemini-1.5-flash',
        apiUrl: 'https://generativelanguage.googleapis.com/v1/models/',
        systemPrompt: `You are ShopAssist AI, a friendly and helpful customer support chatbot for an e-commerce store.

Your personality:
- Warm, professional, and helpful
- Use emojis sparingly to add friendliness
- Keep responses concise but informative
- Always try to solve the customer's problem

You can help with:
- Order tracking and status inquiries
- Returns and refund policies
- Payment methods and issues
- Product recommendations
- Shipping information
- General store questions

Guidelines:
- If you don't know something specific (like a real order number), politely ask for more details
- Suggest helpful next steps
- Be empathetic if the customer has an issue
- Keep responses under 150 words unless more detail is needed

Current store policies:
- 30-day return policy
- Free shipping over $50
- We accept all major credit cards, PayPal, and digital wallets
- Standard shipping: 5-7 days, Express: 2-3 days`
    },

    // Conversation history for context
    conversationHistory: [],

    /**
     * Initialize with API key
     */
    init(apiKey) {
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
     * Send message to Gemini API
     */
    async sendMessage(userMessage) {
        if (!this.config.apiKey) {
            return {
                success: false,
                error: 'API key not configured',
                fallback: true
            };
        }

        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        // Keep conversation history manageable (last 10 exchanges)
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }

        try {
            const response = await fetch(
                `${this.config.apiUrl}${this.config.model}:generateContent?key=${this.config.apiKey}`,
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
                            maxOutputTokens: 500
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API error:', errorData);

                if (response.status === 400 && errorData.error?.message?.includes('API key')) {
                    return {
                        success: false,
                        error: 'Invalid API key. Please check your Gemini API key.',
                        fallback: true
                    };
                }

                throw new Error(errorData.error?.message || 'API request failed');
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
            console.error('Gemini API error:', error);
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
            console.log('📡 Trying Gemini for complex question...');
            const geminiResponse = await this.sendMessage(message);
            console.log('📬 Gemini response:', geminiResponse);

            if (geminiResponse.success) {
                return {
                    text: geminiResponse.text,
                    source: 'gemini',
                    followUp: this.generateFollowUp(message)
                };
            } else {
                // Return visible error if Gemini fails, instead of silent fallback to KB's fallback
                console.error('❌ Gemini mission failed:', geminiResponse.error);
                return {
                    text: `⚠️ **AI Bot Issue**\n\nI tried asking Gemini to help with this, but it ran into an error: *"${geminiResponse.error || 'Unknown API error'}"*\n\nCheck your API key in settings (⚙️) or stick with my basic assistant for now!`,
                    source: 'error',
                    followUp: ['Check settings', 'Return to home']
                };
            }
        }

        // Use knowledge base fallback if AI not configured or something else goes wrong
        console.log('🔄 No AI or fallback needed - using KB fallback');
        return {
            text: kbResponse.text,
            source: 'knowledge_base',
            followUp: kbResponse.followUp
        };
    },

    /**
     * Generate contextual follow-up suggestions
     */
    generateFollowUp(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
            return ['Check another order', 'Return an item', 'Contact support'];
        }
        if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return ['Start return process', 'Check refund status', 'Need help with something else'];
        }
        if (lowerMessage.includes('pay') || lowerMessage.includes('card')) {
            return ['Update payment method', 'View order history', 'Other questions'];
        }
        if (lowerMessage.includes('recommend') || lowerMessage.includes('product')) {
            return ['Show best sellers', 'Browse categories', 'View deals'];
        }

        return ['Track my order', 'Product help', 'Talk to support'];
    },

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }
};

// Export for use in other modules
window.GeminiAI = GeminiAI;
