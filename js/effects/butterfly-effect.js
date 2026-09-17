const TAU = Math.PI * 2;

export class ButterflyEffect {
  constructor() {
    this.time = 0;
    this.hands = [];
    this.butterflies = [];
  }

  async initialize() {
    this.time = 0;
    this.hands = [];

    this.butterflies = [];

    for (let i = 0; i < 10; i++) {
      this.butterflies.push({
        angle: Math.random() * TAU,
        distance: 45 + Math.random() * 100,
        speed: 0.4 + Math.random() * 0.7,
        size: 0.7 + Math.random() * 0.5,
        phase: Math.random() * TAU
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

  drawButterfly(ctx, x, y, size, flap, rotation) {

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.globalAlpha = 0.85;

    ctx.shadowBlur = 14;

    ctx.shadowColor =
      "rgba(255,100,210,.8)";


    /* Left wing */

    ctx.fillStyle =
      "rgba(255,105,210,.85)";

    ctx.beginPath();

    ctx.ellipse(
      -8 * size,
      -3 * size,
      10 * size * flap,
      15 * size,
      -0.4,
      0,
      TAU
    );

    ctx.fill();


    /* Right wing */

    ctx.fillStyle =
      "rgba(150,120,255,.85)";

    ctx.beginPath();

    ctx.ellipse(
      8 * size,
      -3 * size,
      10 * size * flap,
      15 * size,
      0.4,
      0,
      TAU
    );

    ctx.fill();


    /* Body */

    ctx.shadowBlur = 5;

    ctx.fillStyle =
      "rgba(255,230,120,.95)";

    ctx.beginPath();

    ctx.ellipse(
      0,
      4 * size,
      2 * size,
      9 * size,
      0,
      0,
      TAU
    );

    ctx.fill();

    ctx.restore();
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


      for (let i = 0; i < this.butterflies.length; i++) {

        const b = this.butterflies[i];

        const angle =
          b.angle +
          this.time * b.speed;

        const distance =
          b.distance +
          Math.sin(
            this.time * 2 +
            b.phase
          ) * 18;

        const x =
          cx +
          Math.cos(angle) * distance;

        const y =
          cy +
          Math.sin(angle) *
          distance *
          0.65;

        const flap =
          0.65 +
          Math.abs(
            Math.sin(
              this.time * 9 +
              b.phase
            )
          ) * 0.45;

        this.drawButterfly(
          ctx,
          x,
          y,
          b.size,
          flap,
          angle
        );
      }
    }

    ctx.restore();
  }

  onGesture() {}

  destroy() {
    this.hands = [];
    this.butterflies = [];
  }
}