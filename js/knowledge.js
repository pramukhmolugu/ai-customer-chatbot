/**
 * Knowledge Base for ShopAssist AI
 * Contains FAQ responses and pattern matching
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
        GENERAL: 'general'
    },

    // Pattern matching for intent detection
    patterns: {
        order_tracking: [
            /track(ing)?(\s+my)?\s*(order|package|shipment)/i,
            /where('?s|\s+is)?\s*(my)?\s*(order|package)/i,
            /order\s*status/i,
            /when\s*(will|does)\s*(my)?\s*(order|package|it)\s*(arrive|come|get here)/i,
            /delivery\s*(status|update|time)/i,
            /order\s*(id|number)/i
        ],
        returns: [
            /return(s|ing)?(\s+an?|\s+my)?\s*(item|product|order)?/i,
            /refund/i,
            /exchange/i,
            /send\s*(it)?\s*back/i,
            /return\s*policy/i,
            /how\s*(do|can)\s*i\s*return/i,
            /don'?t\s*(want|like)/i
        ],
        payment: [
            /^pay(ment)?s?$/i,
            /pay(ment)?\s*(method|option|way)/i,
            /credit\s*card/i,
            /debit\s*card/i,
            /paypal/i,
            /apple\s*pay/i,
            /google\s*pay/i,
            /how\s*(do|can)\s*i\s*pay/i,
            /accept\s*(what|which)\s*(card|payment)/i,
            /payment\s*(fail|issue|problem|error)/i
        ],
        shipping: [
            /^ship(ping)?$/i,
            /ship(ping)?\s*(cost|fee|charge|rate|option)/i,
            /free\s*ship(ping)?/i,
            /delivery\s*(time|option|fee)/i,
            /how\s*long\s*(does|will)\s*(shipping|delivery)/i,
            /international\s*ship(ping)?/i,
            /express\s*ship(ping)?/i
        ],
        products: [
            /recommend(ation)?/i,
            /suggest(ion)?/i,
            /best\s*(sell(ing|er)|product)/i,
            /popular/i,
            /what\s*(should|would)\s*you\s*recommend/i,
            /looking\s*for/i,
            /need\s*help\s*(finding|choosing)/i,
            /product\s*(info|information|detail)/i
        ],
        account: [
            /^account$/i,
            /password/i,
            /login|log\s*in/i,
            /sign\s*(up|in)/i,
            /email/i,
            /profile/i,
            /update\s*(my)?\s*(info|information|detail)/i
        ],
        greeting: [
            /^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings)/i,
            /how\s*are\s*you/i
        ],
        thanks: [
            /^thanks?$/i,
            /thank(s|\s*you)/i,
            /appreciate/i,
            /helpful/i
        ],
        bye: [
            /^bye$/i,
            /bye|goodbye|see\s*you|talk\s*later/i,
            /that'?s\s*all/i,
            /^(ok|okay|got\s*it)$/i
        ]
    },

    // Responses database
    responses: {
        order_tracking: [
            {
                text: `📦 **Track Your Order**\n\nTo track your order, please provide your order number (found in your confirmation email).\n\nAlternatively, you can:\n• Check your email for tracking updates\n• Log into your account → Order History\n• Use our tracking page with your order ID\n\n🔍 Would you like me to help you find your order number?`,
                followUp: ['I have my order number', 'I can\'t find my order number', 'Check order history']
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
                text: `🚚 **Shipping Options**\n\n| Option | Time | Cost |\n|--------|------|------|\n| Standard | 5-7 days | $4.99 |\n| Express | 2-3 days | $9.99 |\n| Next Day | 1 day | $14.99 |\n\n✨ **FREE shipping** on orders over $50!\n\n🌍 We ship to 50+ countries internationally.\n\nNeed expedited shipping for a specific order?`,
                followUp: ['International shipping', 'Change shipping speed', 'Track package']
            }
        ],
        products: [
            {
                text: `🛍️ **Product Recommendations**\n\nI'd love to help you find the perfect product!\n\n**Our top categories:**\n• 📱 Electronics & Gadgets\n• 👕 Fashion & Apparel\n• 🏠 Home & Living\n• 💄 Beauty & Personal Care\n• 🏃 Sports & Fitness\n\nWhat type of product are you looking for? Or tell me your budget and preferences!`,
                followUp: ['Electronics', 'Fashion', 'Home goods', 'Best sellers']
            }
        ],
        account: [
            {
                text: `👤 **Account Help**\n\nI can help you with:\n• **Password Reset**: Use "Forgot Password" on login page\n• **Update Info**: Go to Account Settings\n• **Order History**: View all past orders\n• **Saved Addresses**: Manage shipping addresses\n\n🔐 For security changes, you may need to verify your email.\n\nWhat would you like to do with your account?`,
                followUp: ['Reset password', 'Update email', 'View orders']
            }
        ],
        greeting: [
            {
                text: `👋 Hello there! Great to see you!\n\nI'm ShopAssist, your AI shopping assistant. I'm here to help you with:\n• 📦 Order tracking\n• 🔄 Returns & refunds\n• 💳 Payment questions\n• 🛍️ Product recommendations\n\nHow can I make your shopping experience better today?`,
                followUp: ['Track my order', 'I have a question', 'Just browsing']
            }
        ],
        thanks: [
            {
                text: `😊 You're welcome! I'm happy I could help!\n\nIs there anything else you'd like assistance with? I'm here 24/7!`,
                followUp: ['Yes, another question', 'No, that\'s all', 'Rate this chat']
            }
        ],
        bye: [
            {
                text: `👋 Thanks for chatting with ShopAssist!\n\nHave a wonderful day, and happy shopping! 🛒✨\n\nFeel free to come back anytime you need help!`,
                followUp: []
            }
        ],
        fallback: [
            {
                text: `🤔 I want to make sure I understand you correctly.\n\nCould you tell me more about what you need help with?\n\nOr try one of these options:`,
                followUp: ['Track order', 'Returns', 'Payments', 'Talk to human']
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
                    return intent;
                }
            }
        }

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

        return {
            intent,
            text: response.text,
            followUp: response.followUp || [],
            confidence: intent === 'fallback' ? 'low' : 'high'
        };
    }
};

// Export for use in other modules
window.KnowledgeBase = KnowledgeBase;
