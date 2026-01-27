/**
 * Voice Input Module
 * Uses Web Speech API for speech recognition
 */

const VoiceInput = {
    // State
    isListening: false,
    recognition: null,
    isSupported: false,

    // DOM elements (set in init)
    elements: {
        voiceBtn: null,
        statusDot: null,
        statusText: null,
        messageInput: null
    },

    /**
     * Initialize voice input
     */
    init() {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            this.isSupported = false;
            this.hideVoiceButton();
            return false;
        }

        this.isSupported = true;

        // Cache DOM elements
        this.elements.voiceBtn = document.getElementById('voiceBtn');
        this.elements.statusDot = document.querySelector('.status-dot');
        this.elements.statusText = document.getElementById('statusText');
        this.elements.messageInput = document.getElementById('messageInput');

        // Initialize recognition
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        // Bind events
        this.bindEvents();

        console.log('🎤 Voice input initialized');
        return true;
    },

    /**
     * Bind speech recognition events
     */
    bindEvents() {
        if (!this.recognition) return;

        // Recognition started
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI(true);
            console.log('🎤 Listening...');
        };

        // Speech result
        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Show interim results in input
            if (interimTranscript) {
                this.elements.messageInput.value = interimTranscript;
                this.elements.messageInput.placeholder = 'Listening...';
            }

            // Process final result
            if (finalTranscript) {
                this.elements.messageInput.value = finalTranscript;
                console.log('📝 Recognized:', finalTranscript);

                // Auto-send the message after a short delay
                setTimeout(() => {
                    if (this.elements.messageInput.value.trim()) {
                        // Trigger send
                        document.getElementById('sendBtn').click();
                    }
                }, 300);
            }
        };

        // Recognition ended
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI(false);
            this.elements.messageInput.placeholder = 'Type your message...';
            console.log('🎤 Stopped listening');
        };

        // Recognition error
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateUI(false);

            // Handle specific errors
            switch (event.error) {
                case 'not-allowed':
                    alert('Microphone access denied. Please allow microphone access in your browser settings.');
                    break;
                case 'no-speech':
                    // No speech detected - silent fail
                    break;
                case 'network':
                    alert('Network error. Please check your internet connection.');
                    break;
            }
        };

        // Voice button click
        this.elements.voiceBtn.addEventListener('click', () => {
            this.toggle();
        });
    },

    /**
     * Toggle listening state
     */
    toggle() {
        if (!this.isSupported) {
            alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
            return;
        }

        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    },

    /**
     * Start listening
     */
    start() {
        if (!this.recognition) return;

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
        }
    },

    /**
     * Stop listening
     */
    stop() {
        if (!this.recognition) return;

        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Failed to stop recognition:', error);
        }
    },

    /**
     * Update UI based on listening state
     */
    updateUI(isListening) {
        if (isListening) {
            this.elements.voiceBtn.classList.add('listening');
            this.elements.statusDot.classList.add('listening');
            this.elements.statusText.textContent = 'Listening...';
            this.elements.messageInput.placeholder = 'Speak now...';
        } else {
            this.elements.voiceBtn.classList.remove('listening');
            this.elements.statusDot.classList.remove('listening');
            this.elements.statusText.textContent = 'Online';
            this.elements.messageInput.placeholder = 'Type your message...';
        }
    },

    /**
     * Hide voice button (for unsupported browsers)
     */
    hideVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
    }
};

// Export for use in other modules
window.VoiceInput = VoiceInput;
