/**
 * Knowledge Base for ShopAssist AI
 * Contains FAQ responses and STRICT pattern matching
 * Only matches EXPLICIT FAQ requests - specific questions go to Gemini
 */

const KnowledgeBase = {
    // FAQ Categories
    categories: {
        ORDER_TRACKING: 'order_tracking',
        RETURNS: 'returns',
        PAYMENT: 'payment',
        SHIPPING: 'shipping',
        PRODUCTS: 'products',
        ACCOUNT: 'account',
        HELP: 'help',
        GENERAL: 'general'
    },

    // STRICT Pattern matching - only matches explicit FAQ requests
    // Specific questions like "gift for coffee lover" should fall through to Gemini
    patterns: {
        order_tracking: [
            /^track\s*(my\s*)?(order|package)$/i,
            /^order\s*(status|tracking)$/i,
            /^where('?s|\s+is)\s+my\s+(order|package)$/i,
            /^check\s*(my\s*)?(order|delivery|shipment)$/i
        ],
        returns: [
            /^return\s*(policy|an?\s*item)?$/i,
            /^returns?\s*(&|and)?\s*refunds?$/i,
            /^how\s*(do|can)\s*i\s*return/i,
            /^refund\s*(policy)?$/i,
            /^exchange\s*(policy)?$/i
        ],
        payment: [
            /^payment\s*(method|option|question)s?$/i,
            /^(what|which)\s*(payment|card)s?\s*(do\s*you\s*)?(accept|take)/i,
            /^(how\s*)?(can|do)\s*i\s*pay/i,
            /^credit\s*card/i,
            /^paypal/i
        ],
        shipping: [
            /^shipping\s*(info|option|cost|rate|time)s?$/i,
            /^(how\s*)?long\s*(does|will)\s*(shipping|delivery)/i,
            /^delivery\s*(time|option|cost)s?$/i,
            /^free\s*shipping/i
        ],
        products: [
            /^product\s*(categor|recommend)/i,
            /^(your|the)\s*products?$/i,
            /^what\s*(do\s*you|products?\s*do\s*you)\s*(sell|have|offer)/i,
            /^show\s*(me\s*)?(your\s*)?products?$/i
        ],
        account: [
            /^(my\s*)?account$/i,
            /^(reset|forgot)\s*(my\s*)?password$/i,
            /^login\s*(help|issue|problem)?$/i,
            /^sign\s*(up|in)$/i
        ],
        help: [
            /^help$/i,
            /^what\s*can\s*you\s*(do|help)/i,
            /^(your\s*)?capabilities$/i,
            /^menu$/i
        ],
        greeting: [
            /^(hi|hello|hey|yo)!?$/i,
            /^good\s*(morning|afternoon|evening)!?$/i,
            /^greetings?!?$/i
        ],
        thanks: [
            /^thanks?!?$/i,
            /^thank\s*you!?$/i,
            /^appreciate\s*(it|that)?!?$/i
        ],
        bye: [
            /^bye!?$/i,
            /^goodbye!?$/i,
            /^(that'?s\s*)?all!?$/i,
            /^(ok|okay|done|exit)!?$/i
        ]
    },

    // Responses database
    responses: {
        order_tracking: [
            {
                text: `📦 **Track Your Order**\n\nTo track your order, please provide your order number (found in your confirmation email).\n\nAlternatively, you can:\n• Check your email for tracking updates\n• Log into your account → Order History\n• Use our tracking page with your order ID\n\n🔍 Would you like me to help you find your order number?`,
                followUp: ['I have my order number', 'Check order history', 'Talk to support']
            }
        ],
        returns: [
            {
                text: `🔄 **Returns & Refunds**\n\nOur return policy:\n• **30-day** return window from delivery\n• Items must be unused with original packaging\n• Free returns on most items\n\n**How to return:**\n1. Log into your account\n2. Go to Order History\n3. Select "Return Item"\n4. Print the prepaid shipping label\n\nRefunds are processed within 5-7 business days.\n\n💡 Need help with a specific return?`,
                followUp: ['Start a return', 'Check return status', 'Talk to support']
            }
        ],
        payment: [
            {
                text: `💳 **Payment Methods**\n\nWe accept:\n• **Credit/Debit Cards**: Visa, Mastercard, Amex, Discover\n• **Digital Wallets**: Apple Pay, Google Pay, PayPal\n• **Buy Now, Pay Later**: Affirm, Klarna, Afterpay\n• **Gift Cards**: Shop gift cards accepted\n\n🔒 All transactions are secured with 256-bit encryption.\n\nHaving payment issues? I can help troubleshoot!`,
                followUp: ['Payment failed', 'Add payment method', 'Gift card balance']
            }
        ],
        shipping: [
            {
                text: `🚚 **Shipping Options**\n\n| Option | Time | Cost |\n|--------|------|------|\n| Standard | 5-7 days | $4.99 |\n| Express | 2-3 days | $9.99 |\n| Next Day | 1 day | $14.99 |\n\n✨ **FREE shipping** on orders over $50!\n\n🌍 We ship to 50+ countries internationally.`,
                followUp: ['International shipping', 'Track package', 'Expedite my order']
            }
        ],
        products: [
            {
                text: `🛍️ **Product Categories**\n\nWe offer a wide range of products:\n\n• 📱 Electronics & Gadgets\n• 👕 Fashion & Apparel\n• 🏠 Home & Living\n• 💄 Beauty & Personal Care\n• 🏃 Sports & Fitness\n\nTell me what you're looking for and I can give you personalized recommendations!`,
                followUp: ['Electronics', 'Fashion', 'Home goods', 'Best sellers']
            }
        ],
        account: [
            {
                text: `👤 **Account Help**\n\nI can help you with:\n• **Password Reset**: Use "Forgot Password" on login page\n• **Update Info**: Go to Account Settings\n• **Order History**: View all past orders\n• **Saved Addresses**: Manage shipping addresses\n\n🔐 For security changes, you may need to verify your email.`,
                followUp: ['Reset password', 'Update email', 'View orders']
            }
        ],
        greeting: [
            {
                text: `👋 Hello! I'm ShopAssist AI, your personal shopping assistant!\n\nI can help you with:\n• 📦 Order tracking\n• 🔄 Returns & refunds\n• 💳 Payment questions\n• 🛍️ Product recommendations\n\nHow can I help you today?`,
                followUp: ['Track my order', 'Product recommendations', 'Help']
            }
        ],
        thanks: [
            {
                text: `😊 You're welcome! Happy I could help!\n\nIs there anything else you need?`,
                followUp: ['Yes, another question', 'No, that\'s all']
            }
        ],
        bye: [
            {
                text: `👋 Thanks for chatting! Have a wonderful day and happy shopping! 🛒✨`,
                followUp: []
            }
        ],
        help: [
            {
                text: `🛠️ **What I Can Do**\n\nI'm ShopAssist AI! I can help with:\n\n• 📦 **Orders**: Track shipments, view history\n• 🔄 **Returns**: Guide you through returns\n• 💳 **Payments**: Answer payment questions\n• 🛍️ **Shopping**: Personalized recommendations\n\nJust ask me anything! For complex questions, I use Gemini AI.`,
                followUp: ['Track my order', 'Return policy', 'Product help']
            }
        ],
        fallback: [
            {
                text: null, // null means: "Don't use KB fallback, go to Gemini instead"
                followUp: []
            }
        ]
    },

    /**
     * Detect user intent from message
     */
    detectIntent(message) {
        const text = message.toLowerCase().trim();

        for (const [intent, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                if (pattern.test(text)) {
                    console.log(`📌 KB matched intent: ${intent}`);
                    return intent;
                }
            }
        }

        // No match - let Gemini handle it
        console.log('📌 No KB match - routing to Gemini');
        return 'fallback';
    },

    /**
     * Get response for detected intent
     */
    getResponse(intent) {
        const responses = this.responses[intent] || this.responses.fallback;
        return responses[Math.floor(Math.random() * responses.length)];
    },

    /**
     * Process message and return response
     */
    processMessage(message) {
        const intent = this.detectIntent(message);
        const response = this.getResponse(intent);

        // If response.text is null, it means "use Gemini"
        if (response.text === null) {
            return {
                intent: 'fallback',
                text: null,
                followUp: [],
                confidence: 'low'
            };
        }

        return {
            intent,
            text: response.text,
            followUp: response.followUp || [],
            confidence: 'high'
        };
    }
};

// Export for use in other modules
window.KnowledgeBase = KnowledgeBase;
