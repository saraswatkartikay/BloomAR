export class EffectManager {
  constructor() {
    this.effects = new Map();
    this.active = null;
  }

  register(id, effect) {
    this.effects.set(id, effect);
    return this;
  }

  async use(id, context) {
    const next = this.effects.get(id);

    if (!next) {
      throw new Error(`Unknown effect: ${id}`);
    }

    try {
      if (this.active && this.active !== next) {
        this.active.destroy?.();
      }

      this.active = next;

      await this.active.initialize?.(context);

    } catch (error) {
      console.error(`Effect "${id}" failed to initialize:`, error);

      // IMPORTANT:
      // Don't leave the app without a valid effect.
      throw error;
    }
  }

  update(context) {
    try {
      this.active?.update?.(context);
    } catch (error) {
      console.error("Effect update error:", error);
    }
  }

  render(context) {
    try {
      this.active?.render?.(context);
    } catch (error) {
      console.error("Effect render error:", error);
    }
  }

  gesture(g, context) {
    try {
      this.active?.onGesture?.(g, context);
    } catch (error) {
      console.error("Effect gesture error:", error);
    }
  }

  reset() {
    this.active?.reset?.();
  }
}