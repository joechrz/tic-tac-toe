/**
 * Main entry point for the Tic-Tac-Toe game
 * Initializes the game when DOM is ready
 */

import { Game } from './Game.js';

/**
 * Initialize the game when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        Game.initialize();
        console.log('Tic-Tac-Toe game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        // Display user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f43f5e;
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: system-ui;
            text-align: center;
            z-index: 9999;
        `;
        errorDiv.innerHTML = `
            <h2>Game Error</h2>
            <p>Failed to initialize the game. Please refresh the page.</p>
        `;
        document.body.appendChild(errorDiv);
    }
});
