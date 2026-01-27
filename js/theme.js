/**
 * Theme Switcher Module
 * Handles light/dark mode toggle with persistence
 */

const ThemeSwitcher = {
    // Current theme
    currentTheme: 'dark',

    // DOM elements
    elements: {
        themeToggle: null,
        html: null
    },

    /**
     * Initialize theme switcher
     */
    init() {
        // Cache DOM elements
        this.elements.themeToggle = document.getElementById('themeToggle');
        this.elements.html = document.documentElement;

        // Load saved theme or detect system preference
        const savedTheme = localStorage.getItem('chat_theme');

        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }

        // Apply theme
        this.applyTheme(this.currentTheme);

        // Bind events
        this.bindEvents();

        console.log(`🎨 Theme initialized: ${this.currentTheme}`);
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Theme toggle button
        this.elements.themeToggle.addEventListener('click', () => {
            this.toggle();
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('chat_theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    /**
     * Toggle between light and dark
     */
    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);

        // Save preference
        localStorage.setItem('chat_theme', newTheme);

        console.log(`🎨 Theme switched to: ${newTheme}`);
    },

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        this.elements.html.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = theme === 'dark' ? '#0a0a0f' : '#f8fafc';
    },

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    },

    /**
     * Check if dark mode
     */
    isDark() {
        return this.currentTheme === 'dark';
    }
};

// Export for use in other modules
window.ThemeSwitcher = ThemeSwitcher;
