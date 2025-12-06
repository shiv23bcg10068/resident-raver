export class InputManager {
  constructor() {
    this.keys = {};
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      
      // Prevent default for game keys
      if (['ArrowLeft', 'ArrowRight', 'x', 'c', 'Tab', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  isPressed(key) {
    return this.keys[key] || false;
  }

  wasPressed(key) {
    if (this.keys[key]) {
      this.keys[key] = false;
      return true;
    }
    return false;
  }

  reset() {
    this.keys = {};
  }

  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}