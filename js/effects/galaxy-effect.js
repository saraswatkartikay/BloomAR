const TAU = Math.PI * 2;

export class GalaxyEffect {
  constructor() {
    this.time = 0;
    this.hands = [];
    this.stars = [];
  }

  async initialize() {
    this.time = 0;
    this.hands = [];

    this.stars = [];

    for (let i = 0; i < 140; i++) {
      this.stars.push({
        angle: Math.random() * TAU,
        radius: 25 + Math.random() * 150,
        speed: 0.2 + Math.random() * 0.8,
        size: 1 + Math.random() * 2,
        alpha: 0.35 + Math.random() * 0.6
      });
    }
  }

  reset() {
    this.time = 0;
  }

  update({ hands, dt }) {
    this.time += dt || 0.016;
    this.hands = hands || [];
  }

  render({ ctx }) {
    if (!ctx) return;

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.save();

    for (const hand of this.hands) {
      const palm = hand[9];

      if (!palm) continue;

      const cx = (1 - palm.x) * w;
      const cy = palm.y * h;

      for (const star of this.stars) {
        const angle =
          star.angle +
          this.time * star.speed;

        const radius =
          star.radius +
          Math.sin(this.time * 2 + star.angle) * 8;

        const x =
          cx + Math.cos(angle) * radius;

        const y =
          cy + Math.sin(angle) * radius * 0.65;

        ctx.globalAlpha = star.alpha;

        ctx.fillStyle =
          "rgba(170,130,255,1)";

        ctx.shadowBlur = 8;

        ctx.shadowColor =
          "rgba(150,100,255,.8)";

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          star.size,
          0,
          TAU
        );

        ctx.fill();
      }
    }

    ctx.restore();
  }

  onGesture() {}

  destroy() {
    this.hands = [];
    this.stars = [];
  }
}