# ShopAssist AI - Customer Support Chatbot

An intelligent AI-powered customer support chatbot for e-commerce, featuring a beautiful dark theme UI and smart responses.

## 🔗 Live Demo

**[Try the Chatbot Live](https://ai-customer-chatbot.vercel.app)**

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered** | Intelligent responses using hybrid AI + Knowledge Base |
| 🎨 **Premium UI** | Dark glassmorphism theme with smooth animations |
| 💬 **Quick Replies** | One-click response buttons for common questions |
| 📱 **Responsive** | Works perfectly on mobile and desktop |
| 💾 **Chat History** | Conversations saved in local storage |
| ⚡ **Fast** | Instant responses for FAQ, AI for complex queries |

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **AI**: Hugging Face Inference API (FREE)
- **Styling**: CSS Variables, Flexbox, Grid
- **Storage**: LocalStorage

## 📁 Project Structure

```
ai-customer-chatbot/
├── index.html          # Main chat interface
├── css/
│   └── styles.css      # Dark theme with glassmorphism
├── js/
│   ├── app.js          # Main application controller
│   ├── ai.js           # AI API integration
│   ├── knowledge.js    # FAQ knowledge base
│   └── chat.js         # Chat UI handling
└── README.md
```

## 🎯 What It Can Help With

- 📦 **Order Tracking** - Check order status and delivery
- 🔄 **Returns & Refunds** - Return policy and process
- 💳 **Payment Questions** - Payment methods and issues
- 🚚 **Shipping Info** - Delivery times and costs
- 🛍️ **Product Recommendations** - Find the right products

## 🚀 Getting Started

### Run Locally

1. Clone the repository:
```bash
git clone https://github.com/pramukhmolugu/ai-customer-chatbot.git
```

2. Open `index.html` in your browser

That's it! No build process or dependencies needed.

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Deploy automatically!

## 🧠 How It Works

1. **User Input** → Message is analyzed
2. **Intent Detection** → Pattern matching identifies topic
3. **Response Selection**:
   - High confidence → Knowledge Base response (instant)
   - Low confidence → AI API response (intelligent)
4. **Display** → Formatted response with follow-up options

## 🔧 Customization

### Add Custom FAQ Responses

Edit `js/knowledge.js`:

```javascript
patterns: {
    your_topic: [
        /pattern1/i,
        /pattern2/i
    ]
},
responses: {
    your_topic: [{
        text: "Your response here",
        followUp: ["Option 1", "Option 2"]
    }]
}
```

### Change Theme Colors

Edit `css/styles.css` variables:

```css
:root {
    --accent-primary: #6366f1;
    --accent-secondary: #8b5cf6;
    --bg-primary: #0a0a0f;
}
```

## 📊 Skills Demonstrated

- ✅ API Integration (REST, async/await)
- ✅ DOM Manipulation
- ✅ Event Handling & Delegation
- ✅ LocalStorage Persistence
- ✅ CSS Animations & Transitions
- ✅ Responsive Design
- ✅ Pattern Matching & Intent Detection
- ✅ Error Handling & Fallbacks

## 📫 Connect With Me

- **LinkedIn**: [Pramukh Chandra Molugu](https://linkedin.com/in/pramukh-chandra-molugu)
- **GitHub**: [pramukhmolugu](https://github.com/pramukhmolugu)

---

*Built with ❤️ by Pramukh Molugu*
