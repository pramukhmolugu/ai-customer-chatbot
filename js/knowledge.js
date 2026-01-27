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
        HELP: 'help',
        GENERAL: 'general'
    },

    // Pattern matching for intent detection
    // IMPORTANT: Patterns should be SPECIFIC to avoid false positives
    // General/open-ended questions should go to Gemini AI
    patterns: {
        order_tracking: [
            /track(ing)?(\s+my)?\s*(order|package|shipment)/i,
            /where('?s|\s+is)?\s*(my)?\s*(order|package)\s*(\?|$)/i,
            /order\s*(status|update|updates|history)/i,
            /when\s*(will|does)\s*(my)?\s*(order|package|it)\s*(arrive|come|get here)/i,
            /delivery\s*(status|update|updates)/i,
            /order\s*(id|number)/i,
            /^my\s*order\s*$/i,
            /check\s*(on\s*)?(my\s*)?order/i
        ],
        returns: [
            /return\s*(policy|process|an?\s+item|my\s+order)/i,
            /how\s*(do|can)\s*i\s*return/i,
            /want\s+to\s+return/i,
            /refund\s*(policy|process|status)?/i,
            /exchange\s*(policy|process|an?\s+item)/i,
            /send\s*(it)?\s*back/i,
            /return\s*(window|period|deadline)/i,
            /get\s*(my\s*)?money\s*back/i
        ],
        payment: [
            /^pay(ment)?\s*(method|option|way)s?\s*(\?)?$/i,
            /what\s*(payment|card)s?\s*(do\s+you\s+)?accept/i,
            /accept\s*(what|which)\s*(card|payment)/i,
            /can\s+i\s+(pay|use)\s+(with\s+)?(credit|debit|paypal|apple\s*pay|google\s*pay)/i,
            /payment\s*(fail|issue|problem|error|declined)/i,
            /how\s*(do|can)\s*i\s*pay\s*(\?)?$/i,
            /credit\s*card\s*(accepted|issue|problem)/i,
            /paypal\s*(accepted|issue|problem)/i
        ],
        shipping: [
            /^ship(ping)?\s*(cost|fee|charge|rate|option|info|information)s?\s*(\?)?$/i,
            /how\s+much\s+(is|does|for)\s*ship(ping)?/i,
            /free\s*ship(ping)?/i,
            /delivery\s*(time|fee|cost|option)s?/i,
            /how\s*long\s*(does|will)\s*(shipping|delivery)\s*(take)?/i,
            /^international\s*ship(ping)?\s*(\?)?$/i,
            /^express\s*ship(ping)?\s*(\?)?$/i,
            /ship(ping)?\s*(to|rate|cost)\s+\w+/i,
            /when\s+will\s+(it|my\s+order)\s+(arrive|be\s+delivered)/i
        ],
        products: [
            // Only match EXPLICIT requests for general recommendations
            // Specific product questions ("gift for coffee lover") should go to Gemini
            /^(product\s+)?recommend(ation)?s?\s*(\?)?$/i,
            /^suggest(ion)?s?\s*(\?)?$/i,
            /^best\s*sell(ing|er)s?\s*(\?)?$/i,
            /^(what\s+are\s+)?(your\s+)?popular\s+(item|product)s?\s*(\?)?$/i,
            /^what\s*(do\s+you|products?\s+do\s+you)\s*(sell|have|offer)/i,
            /^(show|browse)\s*(me\s+)?(your\s+)?products?/i,
            /^product\s*(catalog|categories|list)/i
        ],
        account: [
            /^(my\s+)?account\s*(settings?|info|help)?\s*(\?)?$/i,
            /(forgot|reset|change)\s*(my\s+)?password/i,
            /can'?t\s*(log\s*in|sign\s*in|access)/i,
            /login\s*(issue|problem|help)/i,
            /sign\s*(up|in)\s*(help|issue|problem)/i,
            /update\s*(my)?\s*(email|address|phone|info|profile)/i,
            /delete\s*(my\s+)?account/i,
            /account\s*(locked|disabled|suspended)/i
        ],
        help: [
            /^(what\s+)?(can|do)\s+you\s+(do|help\s+with)\s*(\?)?$/i,
            /^help\s*$/i,
            /^(your\s+)?capabilities\s*(\?)?$/i,
            /^how\s+(do\s+i\s+)?use\s+(this|you)/i,
            /^what\s+is\s+this(\s+chatbot)?\s*(\?)?$/i,
            /^commands?\s*(\?)?$/i,
            /^menu\s*$/i
        ],
        greeting: [
            /^(hi|hello|hey|howdy|hiya|greetings)[\s!.,?]*$/i,
            /^good\s*(morning|afternoon|evening|day)[\s!.,?]*$/i,
            /^how\s*are\s*you[\s!.,?]*$/i,
            /^yo[\s!]*$/i,
            /^what'?s\s*up[\s!?,]*$/i
        ],
        thanks: [
            /^thanks?[\s!.,]*$/i,
            /^thank\s*(you|u)[\s!.,]*$/i,
            /^(that'?s\s+)?(very\s+)?helpful[\s!.,]*$/i,
            /^appreciate\s*(it|that|you)[\s!.,]*$/i,
            /^perfect[\s!.,]*$/i,
            /^great[\s!.,]*$/i,
            /^awesome[\s!.,]*$/i
        ],
        bye: [
            /^bye[\s!.,]*$/i,
            /^goodbye[\s!.,]*$/i,
            /^see\s*(you|ya)[\s!.,]*$/i,
            /^talk\s*(to\s+you\s+)?later[\s!.,]*$/i,
            /^that'?s\s*all[\s!.,]*$/i,
            /^(i'?m\s+)?(all\s+)?(good|done|set)[\s!.,]*$/i,
            /^(ok|okay|k)[\s!.,]*$/i,
            /^take\s*care[\s!.,]*$/i
        ]
    },

    // Responses database
    responses: {
        order_tracking: [
            {
                text: `📦 **Track Your Order**

To track your order, please provide your order number (found in your confirmation email).

Alternatively, you can:
• Check your email for tracking updates
• Log into your account → Order History
• Use our tracking page with your order ID

🔍 Would you like me to help you find your order number?`,
                followUp: ['I have my order number', 'I can\'t find my order number', 'Check order history']
            }
        ],
        returns: [
            {
                text: `🔄 **Returns & Refunds**

Our return policy:
• **30-day** return window from delivery
• Items must be unused with original packaging
• Free returns on most items

**How to return:**
1. Log into your account
2. Go to Order History
3. Select "Return Item"
4. Print the prepaid shipping label

Refunds are processed within 5-7 business days.

💡 Need help with a specific return?`,
                followUp: ['Start a return', 'Check return status', 'Talk to support']
            }
        ],
        payment: [
            {
                text: `💳 **Payment Methods**

We accept:
• **Credit/Debit Cards**: Visa, Mastercard, Amex, Discover
• **Digital Wallets**: Apple Pay, Google Pay, PayPal
• **Buy Now, Pay Later**: Affirm, Klarna, Afterpay
• **Gift Cards**: Shop gift cards accepted

🔒 All transactions are secured with 256-bit encryption.

Having payment issues? I can help troubleshoot!`,
                followUp: ['Payment failed', 'Add payment method', 'Gift card balance']
            }
        ],
        shipping: [
            {
                text: `🚚 **Shipping Options**

| Option | Time | Cost |
|--------|------|------|
| Standard | 5-7 days | $4.99 |
| Express | 2-3 days | $9.99 |
| Next Day | 1 day | $14.99 |

✨ **FREE shipping** on orders over $50!

🌍 We ship to 50+ countries internationally.

Need expedited shipping for a specific order?`,
                followUp: ['International shipping', 'Change shipping speed', 'Track package']
            }
        ],
        products: [
            {
                text: `🛍️ **Product Categories**

Browse our top categories:
• 📱 Electronics & Gadgets
• 👕 Fashion & Apparel
• 🏠 Home & Living
• 💄 Beauty & Personal Care
• 🏃 Sports & Fitness

What category interests you? Or describe what you're looking for and I'll help you find the perfect product!`,
                followUp: ['Electronics', 'Fashion', 'Home goods', 'Best sellers']
            }
        ],
        account: [
            {
                text: `👤 **Account Help**

I can help you with:
• **Password Reset**: Use "Forgot Password" on login page
• **Update Info**: Go to Account Settings
• **Order History**: View all past orders
• **Saved Addresses**: Manage shipping addresses

🔐 For security changes, you may need to verify your email.

What would you like to do with your account?`,
                followUp: ['Reset password', 'Update email', 'View orders']
            }
        ],
        greeting: [
            {
                text: `👋 Hello there! Great to see you!

I'm ShopAssist AI, your personal shopping assistant. I can help you with:
• 📦 Order tracking
• 🔄 Returns & refunds
• 💳 Payment questions
• 🛍️ Product recommendations

How can I make your shopping experience better today?`,
                followUp: ['Track my order', 'I have a question', 'Just browsing']
            }
        ],
        thanks: [
            {
                text: `😊 You're welcome! I'm happy I could help!

Is there anything else you'd like assistance with? I'm here 24/7!`,
                followUp: ['Yes, another question', 'No, that\'s all', 'Rate this chat']
            }
        ],
        bye: [
            {
                text: `👋 Thanks for chatting with ShopAssist!

Have a wonderful day, and happy shopping! 🛒✨

Feel free to come back anytime you need help!`,
                followUp: []
            }
        ],
        help: [
            {
                text: `🛠️ **What I Can Do**

I'm ShopAssist AI, here to make your shopping experience smooth!

**I can help with:**
• 📦 **Orders**: Track shipments, view history, check status
• 🔄 **Returns**: Guide you through our 30-day return policy
• 💳 **Payments**: Answer questions about methods or issues
• 🛍️ **Shopping**: Recommend products, find gifts, answer questions

**Pro tip:** Connect me to **Gemini AI** (⚙️) for smarter, more conversational support!

What would you like help with?`,
                followUp: ['Track my order', 'Return policy', 'Payment methods', 'Find a product']
            }
        ],
        fallback: [
            {
                text: `🤔 I want to make sure I understand you correctly.

Could you tell me more about what you need help with?

Or try one of these common topics:`,
                followUp: ['Track order', 'Returns', 'Payments', 'Talk to human']
            }
        ]
    },

    /**
     * Detect user intent from message
     * Returns 'fallback' for messages that should go to Gemini AI
     */
    detectIntent(message) {
        const text = message.toLowerCase().trim();

        // Check each intent's patterns
        for (const [intent, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                if (pattern.test(text)) {
                    console.log(`📌 KB matched intent: ${intent} with pattern: ${pattern}`);
                    return intent;
                }
            }
        }

        // No match - let Gemini handle it
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
