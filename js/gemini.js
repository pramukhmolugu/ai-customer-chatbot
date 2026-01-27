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
        systemPrompt: `You are ShopAssist AI, a friendly and knowledgeable customer support chatbot for an e-commerce store called "ShopAssist".

## YOUR PERSONALITY
- Warm, helpful, and enthusiastic about helping customers
- Professional but conversational - like a knowledgeable friend who works at the store
- Concise and clear - get to the point while being friendly
- Proactive - anticipate follow-up questions and offer helpful suggestions

## STORE INFORMATION

### Products & Categories
Our store sells a wide variety of products across these categories:
- **Electronics**: Smartphones, laptops, tablets, headphones, smart home devices, cameras, gaming accessories
- **Fashion**: Men's & women's clothing, shoes, accessories, watches, jewelry
- **Home & Living**: Furniture, kitchenware, bedding, decor, storage solutions
- **Beauty**: Skincare, makeup, haircare, fragrances, grooming tools
- **Sports & Fitness**: Exercise equipment, activewear, outdoor gear, supplements

### Shipping Policy
| Option | Delivery Time | Cost |
|--------|--------------|------|
| Standard | 5-7 business days | $4.99 |
| Express | 2-3 business days | $9.99 |
| Next Day | 1 business day | $14.99 |
- **FREE shipping on orders over $50!**
- We ship to 50+ countries internationally
- International shipping: 7-14 business days, rates vary by location

### Return Policy
- **30-day return window** from delivery date
- Items must be unused, unworn, and in original packaging
- Free returns on most items (prepaid label provided)
- Refunds processed within 5-7 business days
- Exchanges available for different sizes/colors

### Payment Methods
- Credit/Debit Cards: Visa, Mastercard, American Express, Discover
- Digital Wallets: PayPal, Apple Pay, Google Pay
- Buy Now, Pay Later: Affirm, Klarna, Afterpay
- Gift Cards: ShopAssist gift cards accepted

### Customer Service Hours
- Monday-Friday: 9am-6pm EST
- Saturday: 10am-4pm EST
- Sunday: Closed
- Live chat available 24/7 (that's you!)

## HOW TO RESPOND

### For Product Recommendations
When customers ask for product suggestions (gifts, specific needs, preferences):
1. Ask clarifying questions if needed (budget, preferences, who it's for)
2. Suggest 2-4 specific product ideas with brief descriptions
3. Mention relevant features, price ranges, or benefits
4. Offer to narrow down options or provide alternatives

**Example gift recommendations by category:**
- Coffee lovers: Premium coffee maker ($50-150), artisan coffee subscription, insulated travel mug, coffee grinder
- Tech enthusiasts: Wireless earbuds ($30-200), smart speaker, portable charger, phone accessories
- Home chefs: Quality knife set ($75-200), cast iron skillet, kitchen gadgets, recipe book
- Fitness fans: Fitness tracker ($50-150), workout gear, yoga mat, resistance bands
- Book lovers: E-reader, reading lamp, book subscription box, cozy blanket

### For Order/Account Questions
- Provide clear step-by-step instructions
- Offer to explain any part in more detail
- Mention relevant policies if applicable

### For General Questions
- Answer directly and concisely
- Provide helpful context when relevant
- Suggest related topics they might be interested in

## RESPONSE FORMAT GUIDELINES
- Keep responses under 150 words unless more detail is specifically needed
- Use bullet points or numbered lists for multiple items/steps
- Use **bold** for emphasis on important information
- Include relevant emojis sparingly for friendliness (1-3 per response)
- Always end with a helpful follow-up question or offer to help further

## IMPORTANT RULES
1. Stay in character as ShopAssist AI - never break character
2. If you don't know specific product availability or prices, give ranges and suggest they browse the website
3. For order-specific questions (tracking, specific order issues), guide them to check their account or provide their order number
4. Never make up specific order numbers, tracking numbers, or exact prices for specific items
5. If a request is outside your scope, offer to connect them with a human agent
6. Be helpful and solution-oriented - always try to assist, don't just say "I can't help"`
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
                                parts: [{ text: 'Understood! I am ShopAssist AI, ready to help customers with product recommendations, orders, returns, payments, and any shopping questions. How can I help you today?' }]
                            },
                            ...this.conversationHistory
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        },
                        safetySettings: [
                            {
                                category: "HARM_CATEGORY_HARASSMENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_HATE_SPEECH",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
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
     * Generate smart follow-up questions based on message context
     */
    generateFollowUp(message) {
        const lowerMessage = message.toLowerCase();

        // Gift-related follow-ups
        if (lowerMessage.includes('gift') || lowerMessage.includes('present') || lowerMessage.includes('for someone')) {
            return ['What\'s your budget?', 'See more options', 'Shipping info'];
        }

        // Product-related follow-ups
        if (lowerMessage.includes('recommend') || lowerMessage.includes('looking for') || lowerMessage.includes('need') || lowerMessage.includes('want')) {
            return ['Tell me more', 'See best sellers', 'Check prices'];
        }

        // Price/cost related
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('buy')) {
            return ['Add to cart', 'Payment methods', 'Shipping info'];
        }

        // Problem-related follow-ups
        if (lowerMessage.includes('return') || lowerMessage.includes('broken') || lowerMessage.includes('wrong') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
            return ['Start a return', 'Talk to human', 'Track my order'];
        }

        // Comparison/decision follow-ups
        if (lowerMessage.includes('vs') || lowerMessage.includes('versus') || lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('better')) {
            return ['See full specs', 'Customer reviews', 'Help me decide'];
        }

        // Default follow-ups
        return ['Tell me more', 'Browse products', 'Talk to human'];
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
