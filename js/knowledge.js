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
        // Gift category patterns - specific takes priority over general
        gift_coffee: [
            /\bcoffee\b/i,
            /\bespresso\b/i,
            /\bcafé\b/i,
            /\bcaffeine\b/i,
            /\bbarista\b/i,
            /coffee.*lover/i,
            /coffee.*gift/i,
            /gift.*coffee/i
        ],
        gift_tech: [
            /\btech\b/i,
            /\btechnology\b/i,
            /\bgadget/i,
            /tech.*enthusiast/i,
            /tech.*lover/i,
            /tech.*gift/i,
            /gift.*tech/i
        ],
        gift_fitness: [
            /\bfitness\b/i,
            /\bworkout\b/i,
            /\bgym\b/i,
            /\byoga\b/i,
            /\bexercise\b/i,
            /fitness.*fan/i,
            /fitness.*gift/i,
            /gift.*fitness/i
        ],
        gift_cook: [
            /\bcook(?:ing)?\b/i,
            /\bkitchen\b/i,
            /\bchef\b/i,
            /\bculinary\b/i,
            /home.*cook/i,
            /cook.*gift/i,
            /gift.*cook/i
        ],
        gift_gamer: [
            /\bgamer/i,
            /\bgaming/i,
            /\bgames?\b/i,
            /video.*game/i,
            /game.*gift/i,
            /gift.*gamer/i
        ],
        gift_reader: [
            /\bbooks?\b/i,
            /\breader/i,
            /\breading\b/i,
            /book.*lover/i,
            /book.*gift/i,
            /gift.*book/i
        ],
        gift_pet: [
            /\bpets?\b/i,
            /\bdog\b/i,
            /\bcat\b/i,
            /\bpuppy\b/i,
            /\bkitten\b/i,
            /pet.*owner/i,
            /pet.*parent/i,
            /pet.*gift/i,
            /gift.*pet/i,
            /dog.*owner/i,
            /cat.*owner/i
        ],
        gift_student: [
            /\bstudent/i,
            /\bcollege/i,
            /\buniversity\b/i,
            /\bschool\b/i,
            /school.*gift/i,
            /gift.*student/i
        ],
        gift_traveler: [
            /\btravel(?:er)?\b/i,
            /\bwanderlust\b/i,
            /\bbackpack(?:er)?\b/i,
            /travel.*gift/i,
            /gift.*travel/i
        ],
        gift_parent: [
            /\bparent/i,
            /\bbaby\b/i,
            /\binfant\b/i,
            /\btoddler\b/i,
            /new.*parent/i,
            /parent.*gift/i,
            /baby.*gift/i,
            /gift.*baby/i
        ],
        gift_ideas: [
            /gift/i,
            /present/i,
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
                text: `🎁 **Gift Recommendations by Category**\n\n**☕ Coffee Lover** • **📱 Tech** • **🏃 Fitness**\n**🍳 Home Cook** • **🎮 Gamer** • **📚 Reader**\n**🐾 Pet Owner** • **🎓 Student** • **✈️ Traveler** • **👶 Parent**\n\nWhich category interests you? Or tell me about the person!`,
                followUp: ['Coffee Lover', 'Gamer', 'Tech Enthusiast', 'Fitness Fan', 'Home Cook']
            }
        ],
        gift_coffee: [
            {
                text: `☕ **Gifts for Coffee Lovers**\n\n• **Keurig K-Mini Coffee Maker** - $79\n  Compact single-serve brewer, perfect for small spaces\n\n• **Burr Coffee Grinder** - $45\n  Consistent grind for better flavor\n\n• **Contigo Travel Mug** - $28\n  Keeps coffee hot for 7+ hours\n\n• **Atlas Coffee Club Subscription** - $25/mo\n  World coffee delivered monthly\n\nPerfect for the caffeine enthusiast! ☕`,
                followUp: ['Other gift ideas', 'Under $50', 'Tech gifts']
            }
        ],
        gift_tech: [
            {
                text: `📱 **Gifts for Tech Enthusiasts**\n\n• **Apple AirPods (3rd Gen)** - $129\n  Spatial audio, wireless charging\n\n• **Echo Dot (5th Gen)** - $50\n  Smart speaker with Alexa\n\n• **Anker PowerCore 20K** - $35\n  Charges phone 4-5 times\n\n• **LED Smart Desk Lamp** - $42\n  App-controlled, adjustable colors\n\nGreat for gadget lovers! 🔌`,
                followUp: ['Other gift ideas', 'Gamer gifts', 'Student gifts']
            }
        ],
        gift_fitness: [
            {
                text: `🏃 **Gifts for Fitness Fans**\n\n• **Hydro Flask Smart Bottle** - $45\n  Temperature tracking, 24hr cold\n\n• **Manduka Yoga Mat Bundle** - $55\n  Premium mat + strap + blocks\n\n• **Resistance Band Set** - $32\n  5 bands with handles, door anchor\n\n• **Fitbit Inspire 3** - $99\n  Tracks steps, heart rate, sleep\n\nPerfect for active lifestyles! 💪`,
                followUp: ['Other gift ideas', 'Under $50', 'Tech gifts']
            }
        ],
        gift_cook: [
            {
                text: `🍳 **Gifts for Home Cooks**\n\n• **Instant Pot Duo 7-in-1** - $89\n  Pressure cooker, slow cooker, rice maker\n\n• **Cuisinart Knife Set** - $65\n  15-piece professional quality\n\n• **OXO Kitchen Tool Set** - $45\n  11 essential gadgets\n\n• **Lodge Cast Iron Skillet** - $35\n  Pre-seasoned 12\" pan\n\nPerfect for culinary enthusiasts! 👨‍🍳`,
                followUp: ['Other gift ideas', 'Coffee gifts', 'Premium gifts']
            }
        ],
        gift_gamer: [
            {
                text: `🎮 **Gifts for Gamers**\n\n• **Logitech G502 Gaming Mouse** - $49\n  11 programmable buttons, RGB\n\n• **HyperX Cloud Headset** - $79\n  7.1 surround sound, noise-canceling mic\n\n• **RGB Mousepad** - $29\n  Large, customizable lighting\n\n• **Steam Gift Card $50** - $50\n  Thousands of games to choose from\n\nLevel up their setup! 🕹️`,
                followUp: ['Other gift ideas', 'Tech gifts', 'Student gifts']
            }
        ],
        gift_reader: [
            {
                text: `📚 **Gifts for Book Lovers**\n\n• **Kindle Paperwhite** - $139\n  Waterproof, adjustable warm light\n\n• **Book Light Clip-On** - $16\n  Rechargeable, 3 brightness levels\n\n• **Bookends Set** - $28\n  Decorative metal design\n\n• **Barnes & Noble Gift Card** - $50\n  Millions of titles available\n\nFor the avid reader! 📖`,
                followUp: ['Other gift ideas', 'Student gifts', 'Under $50']
            }
        ],
        gift_pet: [
            {
                text: `🐾 **Gifts for Pet Owners**\n\n• **Furbo Dog Camera** - $99\n  Treat tossing, barking alerts, 2-way audio\n\n• **Interactive Cat Toy** - $25\n  Automatic feather wand, USB rechargeable\n\n• **Self-Cleaning Litter Box** - $189\n  Automatic scooping, odor control\n\n• **Pet Grooming Kit** - $39\n  Clippers, brushes, nail trimmer\n\nPerfect for pet parents! 🐕🐈`,
                followUp: ['Other gift ideas', 'Under $50', 'Parent gifts']
            }
        ],
        gift_student: [
            {
                text: `🎓 **Gifts for Students**\n\n• **iPad (9th Gen)** - $329\n  Perfect for notes, studying, entertainment\n\n• **Anker USB-C Hub** - $45\n  7-in-1, HDMI, USB, SD card reader\n\n• **Noise-Canceling Headphones** - $89\n  Focus mode for studying\n\n• **Moleskine Classic Notebook** - $18\n  Hard cover, dot grid pages\n\nHelp them succeed! 📝`,
                followUp: ['Other gift ideas', 'Tech gifts', 'Under $50']
            }
        ],
        gift_traveler: [
            {
                text: `✈️ **Gifts for Travelers**\n\n• **Samsonite Carry-On** - $129\n  Spinner wheels, TSA-approved lock\n\n• **Tile Pro Tracker 4-Pack** - $79\n  Find luggage, keys, phone anywhere\n\n• **Universal Travel Adapter** - $29\n  150+ countries, USB ports\n\n• **Portable Luggage Scale** - $12\n  Avoid overweight fees\n\nFor the adventurer! 🌍`,
                followUp: ['Other gift ideas', 'Tech gifts', '$50-$100']
            }
        ],
        gift_parent: [
            {
                text: `👶 **Gifts for New Parents**\n\n• **Baby Monitor with Camera** - $149\n  1080p HD, night vision, 2-way talk\n\n• **Diaper Bag Backpack** - $59\n  18 pockets, insulated, USB port\n\n• **White Noise Machine** - $39\n  20+ sounds, night light, timer\n\n• **Baby Book Memory Journal** - $24\n  First year milestones & photos\n\nSupport new parents! 👪`,
                followUp: ['Other gift ideas', 'Pet gifts', '$100-$200']
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
