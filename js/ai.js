/**
 * AI Integration Module
 * Handles communication with Hugging Face API for intelligent responses
 */

const AIService = {
    // Hugging Face API configuration
    config: {
        // Using a free model - DialoGPT for conversational AI
        model: 'microsoft/DialoGPT-medium',
        apiUrl: 'https://api-inference.huggingface.co/models/',
        // Note: For production, use your own API key from huggingface.co
        // This is a demo key with rate limits
        apiKey: null, // Set via AIService.setApiKey() if you have one
        timeout: 10000, // 10 second timeout
        maxRetries: 2
    },

    // Conversation context for better responses
    conversationHistory: [],

    /**
     * Set API key (optional - works without for demo)
     */
    setApiKey(key) {
        this.config.apiKey = key;
    },

    /**
     * Query Hugging Face API
     */
    async query(message) {
        // Add to conversation history
        this.conversationHistory.push(message);

        // Keep only last 5 messages for context
        if (this.conversationHistory.length > 5) {
            this.conversationHistory.shift();
        }

        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            // Add API key if available
            if (this.config.apiKey) {
                headers['Authorization'] = `Bearer ${this.config.apiKey}`;
            }

            const response = await fetch(
                `${this.config.apiUrl}${this.config.model}`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        inputs: {
                            past_user_inputs: this.conversationHistory.slice(0, -1),
                            generated_responses: [],
                            text: message
                        },
                        options: {
                            wait_for_model: true
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.generated_text) {
                return {
                    success: true,
                    text: data.generated_text,
                    source: 'ai'
                };
            } else if (data.error) {
                throw new Error(data.error);
            }

            return {
                success: false,
                text: null,
                source: 'ai',
                error: 'No response generated'
            };

        } catch (error) {
            console.warn('AI API error:', error.message);
            return {
                success: false,
                text: null,
                source: 'ai',
                error: error.message
            };
        }
    },

    /**
     * Enhanced response using AI + Knowledge Base hybrid approach
     */
    async getSmartResponse(message) {
        // First, try knowledge base for quick, accurate responses
        const kbResponse = KnowledgeBase.processMessage(message);

        // If knowledge base has high confidence, use it
        if (kbResponse.confidence > 0.7) {
            return {
                text: kbResponse.text,
                followUp: kbResponse.followUp,
                source: 'knowledge_base',
                intent: kbResponse.intent
            };
        }

        // For low confidence, try AI API (with fallback)
        const aiResponse = await this.query(message);

        if (aiResponse.success && aiResponse.text) {
            return {
                text: this.formatAIResponse(aiResponse.text),
                followUp: ['Tell me more', 'I have another question', 'That helps, thanks!'],
                source: 'ai',
                intent: 'ai_generated'
            };
        }

        // Fallback to enhanced knowledge base response
        return {
            text: this.generateFallbackResponse(message),
            followUp: kbResponse.followUp,
            source: 'fallback',
            intent: 'fallback'
        };
    },

    /**
     * Format AI response to be more helpful
     */
    formatAIResponse(text) {
        // Clean up and enhance AI response
        let formatted = text.trim();

        // Add helpful context if response is short
        if (formatted.length < 50) {
            formatted += '\n\nIs there anything specific I can help you with?';
        }

        return formatted;
    },

    /**
     * Generate contextual fallback response
     */
    generateFallbackResponse(message) {
        const responses = [
            `I'm here to help! Could you provide more details about your question?\n\nI can assist with:\n• Order tracking and status\n• Returns and refunds\n• Payment methods\n• Shipping information\n• Product recommendations`,

            `Great question! Let me make sure I understand correctly.\n\nCan you tell me more about what you're looking for? This helps me give you the most accurate information.`,

            `I want to give you the best possible answer! 🎯\n\nCould you rephrase your question or choose from these common topics?\n• Track my order\n• Return an item\n• Payment help\n• Shipping info`,
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    },

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }
};

// Export for use in other modules
window.AIService = AIService;
