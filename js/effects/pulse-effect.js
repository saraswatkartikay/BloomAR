export class PulseEffect {
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

      const x = point.x * w;
      const y = point.y * h;

      const pulse = 30 + Math.sin(this.time * 5) * 10;

      ctx.beginPath();
      ctx.arc(x, y, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,220,255,0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, pulse * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,220,255,0.25)";
      ctx.fill();
    }

    ctx.restore();
  }

  onGesture() {}
}