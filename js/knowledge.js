/**
 * Knowledge Base for ShopAssist AI
 * Self-sufficient chatbot with product recommendations
 * No external API required!
 */

const KnowledgeBase = {
    categories: {
        ORDER_TRACKING: 'order_tracking',
        RETURNS: 'returns',
        PAYMENT: 'payment',
        SHIPPING: 'shipping',
        PRODUCTS: 'products',
        GIFT_IDEAS: 'gift_ideas',
        ACCOUNT: 'account',
        HELP: 'help',
        GENERAL: 'general'
    },

    patterns: {
        order_tracking: [
            /track.*order/i,
            /where.*order/i,
            /order.*status/i,
            /delivery.*status/i
        ],
        returns: [
            /return/i,
            /refund/i,
            /exchange/i
        ],
        payment: [
            /payment/i,
            /pay/i,
            /credit.*card/i,
            /paypal/i
        ],
        shipping: [
            /shipping/i,
            /delivery.*cost/i,
            /how.*long.*ship/i
        ],
        gift_ideas: [
            /gift/i,
            /present/i,
            /coffee.*lover/i,
            /tech.*enthusiast/i,
            /fitness.*fan/i,
            /home.*cook/i,
            /gamer/i,
            /gaming/i,
            /book.*lover/i,
            /reader/i,
            /pet.*owner/i,
            /student/i,
            /traveler/i,
            /parent/i,
            /recommend/i,
            /suggest/i
        ],
        products: [
            /product/i,
            /electronics/i,
            /fashion/i,
            /home/i,
            /beauty/i
        ],
        account: [
            /account/i,
            /password/i,
            /login/i
        ],
        help: [
            /help/i,
            /what.*can.*you/i
        ],
        greeting: [
            /^(hi|hello|hey)$/i
        ],
        thanks: [
            /thanks/i,
            /thank.*you/i
        ],
        bye: [
            /bye/i,
            /goodbye/i
        ]
    },

    responses: {
        order_tracking: [
            {
                text: `📦 **Track Your Order**\n\nTo track your order:\n• Check your email for tracking number\n• Log into your account → Order History\n• Use your order ID from confirmation email\n\nNeed help finding your order number?`,
                followUp: ['I have my order number', 'Check order history']
            }
        ],
        returns: [
            {
                text: `🔄 **Returns & Refunds**\n\n• **30-day** return window\n• Items must be unused with original packaging\n• Free returns on most items\n\n**How to return:**\n1. Log into account\n2. Order History → Select item\n3. Print prepaid label\n\nRefunds processed in 5-7 business days.`,
                followUp: ['Start a return', 'Check return status']
            }
        ],
        payment: [
            {
                text: `💳 **Payment Methods**\n\nWe accept:\n• Visa, Mastercard, Amex, Discover\n• PayPal, Apple Pay, Google Pay\n• Affirm, Klarna (Buy Now, Pay Later)\n• Gift Cards\n\n🔒 256-bit encryption for all transactions.`,
                followUp: ['Payment failed', 'Gift card balance']
            }
        ],
        shipping: [
            {
                text: `🚚 **Shipping Options**\n\n| Option | Time | Cost |\n|--------|------|------|\n| Standard | 5-7 days | $4.99 |\n| Express | 2-3 days | $9.99 |\n| Next Day | 1 day | $14.99 |\n\n✨ **FREE** on orders $50+\n🌍 Ships to 50+ countries`,
                followUp: ['International shipping', 'Track package']
            }
        ],
        gift_ideas: [
            {
                text: `🎁 **Gift Recommendations by Category**\n\n**☕ Coffee Lover**\n• Keurig K-Mini Coffee Maker - $79\n• Burr Coffee Grinder - $45\n• Contigo Travel Mug - $28\n• Atlas Coffee Club Subscription - $25/mo\n\n**📱 Tech Enthusiast**\n• Apple AirPods (3rd Gen) - $129\n• Echo Dot (5th Gen) - $50\n• Anker PowerCore 20K - $35\n• LED Smart Desk Lamp - $42\n\n**🏃 Fitness Fan**\n• Hydro Flask Smart Bottle - $45\n• Manduka Yoga Mat Bundle - $55\n• Resistance Band Set - $32\n• Fitbit Inspire 3 - $99\n\n**🍳 Home Cook**\n• Instant Pot Duo 7-in-1 - $89\n• Cuisinart Knife Set - $65\n• OXO Kitchen Tool Set - $45\n• Lodge Cast Iron Skillet - $35\n\n**🎮 Gamer**\n• Logitech G502 Gaming Mouse - $49\n• HyperX Cloud Headset - $79\n• RGB Mousepad - $29\n• Steam Gift Card $50 - $50\n\n**📚 Book Lover**\n• Kindle Paperwhite - $139\n• Book Light Clip-On - $16\n• Bookends Set - $28\n• Barnes & Noble Gift Card - $50\n\n**🐾 Pet Owner**\n• Furbo Dog Camera - $99\n• Interactive Cat Toy - $25\n• Self-Cleaning Litter Box - $189\n• Pet Grooming Kit - $39\n\n**🎓 Student**\n• iPad (9th Gen) - $329\n• Anker USB-C Hub - $45\n• Noise-Canceling Headphones - $89\n• Moleskine Classic Notebook - $18\n\n**✈️ Traveler**\n• Samsonite Carry-On - $129\n• Tile Pro Tracker 4-Pack - $79\n• Universal Travel Adapter - $29\n• Portable Luggage Scale - $12\n\n**👶 New Parent**\n• Baby Monitor with Camera - $149\n• Diaper Bag Backpack - $59\n• White Noise Machine - $39\n• Baby Book Memory Journal - $24\n\nNeed suggestions for a specific budget range?`,
                followUp: ['Under $50', '$50-$100', '$100-$200', 'Premium $200+']
            }
        ],
        products: [
            {
                text: `🛍️ **Product Categories**\n\n📱 **Electronics** - Phones, headphones, smart devices\n👕 **Fashion** - Clothing, accessories, shoes\n🏠 **Home & Living** - Furniture, decor, kitchen\n💄 **Beauty** - Skincare, makeup, hair care\n🏃 **Sports & Fitness** - Equipment, apparel, nutrition\n\nWhich category interests you?`,
                followUp: ['Electronics', 'Fashion', 'Home', 'Best sellers']
            }
        ],
        account: [
            {
                text: `👤 **Account Help**\n\n• **Reset Password** - Use "Forgot Password"\n• **Update Info** - Account Settings\n• **Order History** - View past orders\n• **Addresses** - Manage shipping info\n\n🔐 Email verification required for security changes.`,
                followUp: ['Reset password', 'Update email']
            }
        ],
        greeting: [
            {
                text: `👋 Hello! I'm ShopAssist AI!\n\nI can help you with:\n• 📦 Order tracking\n• 🔄 Returns & refunds\n• 💳 Payment questions\n• 🎁 Gift recommendations\n• 🛍️ Product suggestions\n\nHow can I help you today?`,
                followUp: ['Track order', 'Gift ideas', 'Product recommendations']
            }
        ],
        thanks: [
            {
                text: `😊 You're welcome! Happy to help!\n\nAnything else you need?`,
                followUp: ['Yes, another question', 'No, that\'s all']
            }
        ],
        bye: [
            {
                text: `👋 Thanks for chatting! Have a wonderful day! 🛒✨`,
                followUp: []
            }
        ],
        help: [
            {
                text: `🛠️ **What I Can Do**\n\n• 📦 Track orders and shipments\n• 🔄 Guide you through returns\n• 💳 Answer payment questions\n• 🎁 Suggest gift ideas\n• 🛍️ Recommend products\n\n**Note:** I work 100% offline - no external AI needed!`,
                followUp: ['Track order', 'Gift ideas', 'Products']
            }
        ],
        fallback: [
            {
                text: `I'd love to help! Could you tell me more about:\n\n• Tracking an order?\n• Returns or refunds?\n• Gift recommendations?\n• Product questions?\n• Account help?`,
                followUp: ['Track order', 'Gift ideas', 'Returns', 'Products']
            }
        ]
    },

    detectIntent(message) {
        const text = message.toLowerCase().trim();

        for (const [intent, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                if (pattern.test(text)) {
                    console.log(`📌 Matched intent: ${intent}`);
                    return intent;
                }
            }
        }

        return 'fallback';
    },

    getResponse(intent) {
        const responses = this.responses[intent] || this.responses.fallback;
        return responses[Math.floor(Math.random() * responses.length)];
    },

    processMessage(message) {
        const intent = this.detectIntent(message);
        const response = this.getResponse(intent);

        return {
            intent,
            text: response.text,
            followUp: response.followUp || [],
            confidence: intent === 'fallback' ? 'medium' : 'high',
            source: 'knowledge_base'
        };
    }
};

window.KnowledgeBase = KnowledgeBase;
