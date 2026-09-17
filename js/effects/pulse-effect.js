const TAU = Math.PI * 2;

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

      const x = (1 - palm.x) * w;
      const y = palm.y * h;

      /* Main pulse */

      const pulse =
        35 + Math.sin(this.time * 6) * 12;

      ctx.globalAlpha = 0.8;

      ctx.strokeStyle =
        "rgba(40,220,255,.9)";

      ctx.lineWidth = 3;

      ctx.shadowBlur = 18;

      ctx.shadowColor =
        "rgba(40,220,255,.8)";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        pulse,
        0,
        TAU
      );

      ctx.stroke();


      /* Second pulse */

      const pulse2 =
        65 + Math.sin(this.time * 4) * 15;

      ctx.globalAlpha = 0.35;

      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        pulse2,
        0,
        TAU
      );

      ctx.stroke();


      /* Finger energy points */

      for (const index of [4, 8, 12, 16, 20]) {

        const finger = hand[index];

        if (!finger) continue;

        const fx = (1 - finger.x) * w;
        const fy = finger.y * h;

        const size =
          4 + Math.sin(this.time * 8 + index) * 2;

        ctx.globalAlpha = 0.9;

        ctx.fillStyle =
          "rgba(80,235,255,1)";

        ctx.beginPath();

        ctx.arc(
          fx,
          fy,
          size,
          0,
          TAU
        );

        ctx.fill();


        /* Energy line */

        ctx.globalAlpha = 0.35;

        ctx.beginPath();

        ctx.moveTo(x, y);
        ctx.lineTo(fx, fy);

        ctx.stroke();
      }
    }

    ctx.restore();
  }

  onGesture() {}

  destroy() {
    this.hands = [];
  }
}