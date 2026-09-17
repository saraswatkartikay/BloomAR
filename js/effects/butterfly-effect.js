export class ButterflyEffect {
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

    for (const hand of this.hands) {
      const point = hand[9] || hand[0];

      if (!point) continue;

      const cx = point.x * w;
      const cy = point.y * h;

      for (let i = 0; i < 6; i++) {
        const angle =
          this.time * 2 +
          i * Math.PI / 3;

        const distance = 45 + Math.sin(this.time * 3 + i) * 15;

        const x =
          cx + Math.cos(angle) * distance;

        const y =
          cy + Math.sin(angle) * distance;

        const flap =
          0.7 + Math.sin(this.time * 8 + i) * 0.3;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.ellipse(
          -10,
          0,
          15 * flap,
          8,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,120,220,0.75)";
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(
          10,
          0,
          15 * flap,
          8,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(150,120,255,0.75)";
        ctx.fill();

        ctx.restore();
      }
    }

    ctx.restore();
  }

  onGesture() {}
}