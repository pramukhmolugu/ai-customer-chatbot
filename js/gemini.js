/**
 * Gemini AI Integration
 * Uses Google's Generative AI API for intelligent responses
 * Enhanced system prompt for product recommendations
 */

const GeminiAI = {
    // Configuration
    config: {
        apiKey: null,
        model: 'gemini-1.5-flash',
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
        systemPrompt: `You are ShopAssist AI, a friendly and knowledgeable customer support chatbot for an e-commerce store called "ShopAssist".

YOUR PERSONALITY:
- Warm, professional, and genuinely enthusiastic about helping customers
- Conversational but efficient - don't ramble
- Use emojis sparingly to add warmth (1-2 per response max)

PRODUCT KNOWLEDGE - You sell products in these categories:

📱 ELECTRONICS & GADGETS:
- Smart home devices (speakers, lights, thermostats)
- Headphones & earbuds ($29-$349)
- Portable chargers & power banks
- Wireless keyboards & mice
- Streaming devices (Roku, Fire TV, Chromecast)

👕 FASHION & APPAREL:
- Men's & women's casual wear
- Athletic wear & activewear
- Accessories (watches, bags, sunglasses)
- Seasonal collections

🏠 HOME & LIVING:
- Kitchen gadgets & appliances
- Bedding & linens
- Organization & storage solutions
- Decor items

💄 BEAUTY & PERSONAL CARE:
- Skincare sets & individual products
- Hair care tools & products
- Makeup & cosmetics
- Personal grooming devices

🏃 SPORTS & FITNESS:
- Yoga mats & accessories
- Resistance bands & weights
- Fitness trackers
- Water bottles & gym bags

GIFT RECOMMENDATION EXAMPLES:
- Coffee lover: Premium coffee maker ($79), electric grinder ($45), coffee subscription box ($25/mo), insulated travel mug ($28)
- Tech enthusiast: Wireless earbuds ($129), smart home starter kit ($99), portable power bank ($35)
- Fitness fan: Smart water bottle ($45), yoga mat set ($55), resistance band kit ($32)
- Home cook: Air fryer ($89), knife set ($120), smart kitchen scale ($35)

STORE POLICIES:
- Shipping: Standard 5-7 days ($4.99), Express 2-3 days ($9.99), Next Day ($14.99). FREE on orders $50+
- Returns: 30 days, unused items in original packaging. Free return shipping.
- Payment: Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, Google Pay, Affirm, Klarna

RESPONSE GUIDELINES:
1. For product questions: Suggest 2-4 specific items with prices
2. For gift recommendations: Ask about budget if not mentioned, then give personalized suggestions
3. Keep responses under 150 words unless the question requires more detail
4. Always offer to help further or provide more options
5. If you don't know something specific, offer to connect them with a human agent

NEVER:
- Make up product names that don't fit the categories above
- Provide false information about policies
- Be pushy or use high-pressure sales tactics`
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

        const modelsToTry = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest'
        ];

        const activeModel = modelsToTry[retryCount] || modelsToTry[0];

        if (retryCount === 0) {
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }
        }

        try {
            console.log(`📡 Trying Gemini (${activeModel})...`);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/${activeModel}:generateContent?key=${this.config.apiKey}`,
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
                                parts: [{ text: 'Understood! I am ShopAssist AI, ready to help with product recommendations, orders, returns, and more. How can I assist you today?' }]
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
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!responseText) {
                throw new Error('No response generated');
            }

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
     * Get smart response - KB for FAQ, Gemini for everything else
     */
    async getResponse(message) {
        const kbResponse = KnowledgeBase.processMessage(message);

        // If KB has a confident match (not fallback), use it
        if (kbResponse.confidence === 'high' && kbResponse.text !== null) {
            console.log('📚 Using KB response for:', kbResponse.intent);
            return {
                text: kbResponse.text,
                source: 'knowledge_base',
                followUp: kbResponse.followUp
            };
        }

        // Otherwise, use Gemini
        if (this.isConfigured()) {
            console.log('🧠 Routing to Gemini AI...');
            const geminiResponse = await this.sendMessage(message);

            if (geminiResponse.success) {
                return {
                    text: geminiResponse.text,
                    source: 'gemini',
                    followUp: this.generateFollowUp(message)
                };
            } else {
                console.error('❌ Gemini failed:', geminiResponse.error);
                return {
                    text: `⚠️ I'm having trouble connecting to my AI brain right now.\n\nError: *${geminiResponse.error}*\n\nPlease check your API key in settings (⚙️) or try again later.`,
                    source: 'error',
                    followUp: ['Check settings', 'Try again']
                };
            }
        }

        // No Gemini configured - use generic fallback
        return {
            text: `🤔 I'd love to help with that! For personalized recommendations, please set up your Gemini API key in settings (⚙️).\n\nOr try one of these:`,
            source: 'fallback',
            followUp: ['Track order', 'Returns', 'Shipping info', 'Payment help']
        };
    },

    /**
     * Generate contextual follow-up suggestions
     */
    generateFollowUp(message) {
        const lower = message.toLowerCase();

        if (lower.includes('gift') || lower.includes('recommend')) {
            return ['More gift ideas', 'Different price range', 'Another category'];
        }
        if (lower.includes('order') || lower.includes('track')) {
            return ['Track another order', 'Return this item', 'Contact support'];
        }
        if (lower.includes('return') || lower.includes('refund')) {
            return ['Start a return', 'Check refund status', 'Talk to human'];
        }

        return ['Tell me more', 'Different question', 'Help'];
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
