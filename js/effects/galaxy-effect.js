export class GalaxyEffect {
  constructor() {
    this.time = 0;
    this.hands = [];
  }

  async initialize() {
    this.time = 0;
    this.hands = [];
  }

  reset() {
    this.time = 0;
    this.hands = [];
  }

  update(hands, gesture, dt, ctx) {
    this.time += dt || 0.016;
    this.hands = hands || [];
  }

  render(ctx) {
    if (!ctx) return;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.save();

    // Default center
    let cx = w / 2;
    let cy = h / 2;

    // Follow first detected hand
    if (this.hands.length > 0) {
      const hand = this.hands[0];

      // MediaPipe hand landmarks
      const point = hand[9] || hand[0];

      if (point) {
        cx = point.x * w;
        cy = point.y * h;
      }
    }

    for (let i = 0; i < 100; i++) {
      const angle = i * 0.45 + this.time * 0.8;
      const radius = 20 + (i * 11) % 220;

      const x =
        cx +
        Math.cos(angle) * radius;

      const y =
        cy +
        Math.sin(angle) *
        radius *
        0.6;

      const size = 1 + (i % 3);

      ctx.fillStyle = "rgba(150,120,255,0.8)";

      ctx.beginPath();
      ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  onGesture() {}
}