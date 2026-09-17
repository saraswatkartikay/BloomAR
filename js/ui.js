export class UI {
  constructor() {
    this.$ = s => document.querySelector(s);
    this.toastTimer = null;
  }

  scrollTo(sel) {
    this.$(sel)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  toast(msg) {
    const el = this.$("#toast");

    if (!el) return;

    el.textContent = msg;
    el.classList.add("show");

    clearTimeout(this.toastTimer);

    this.toastTimer = setTimeout(() => {
      el.classList.remove("show");
    }, 2400);
  }

  setTracking(state, text) {
    const badge = this.$(".tracking-badge");
    const dot = this.$("#trackingDot");

    if (!badge || !dot) return;

    this.$("#trackingText").textContent = text;

    badge.classList.toggle(
      "active",
      state === "tracked"
    );

    dot.style.background =
      state === "error"
        ? "#ff5d91"
        : "";
  }

  setGesture(name) {
    const pretty = {
      waiting: "Waiting for hand",
      open: "Open hand · Blooming",
      spread: "Spread fingers · Growing",
      closed: "Closed hand · Bud mode",
      neutral: "Move your hand",
      pinch: "Pinch · Interaction"
    };

    this.$("#gestureChip").textContent =
      pretty[name] || name;

    this.$("#gestureValue").textContent =
      name === "waiting" ? "—" : name;
  }

  setStats(hands, fps) {
    this.$("#handCount").textContent = hands;

    this.$("#fpsValue").textContent =
      fps || "—";

    this.$("#fpsBadge").textContent =
      `${fps || "--"} FPS`;
  }

  cameraEmpty(show) {
    this.$("#emptyState").style.display =
      show ? "grid" : "none";
  }

  showCapture(data) {
    this.$("#captureImage").src = data;
    this.$("#downloadCapture").href = data;
    this.$("#captureModal").hidden = false;
  }

  closeCapture() {
    this.$("#captureModal").hidden = true;
  }

  initInteractions(app) {

    /* ---------------- FILTER SWITCHING ---------------- */

    document
      .querySelectorAll(".effect-btn[data-effect]")
      .forEach(button => {

        button.addEventListener("click", async e => {

          e.preventDefault();
          e.stopPropagation();

          const effect =
            button.dataset.effect;

          if (!effect) return;

          try {

            await app.effects.use(
              effect,
              {}
            );

            /* Active card */

            document
              .querySelectorAll(".filter-card")
              .forEach(card => {
                card.classList.remove("featured");
              });

            const card =
              button.closest(".filter-card");

            card?.classList.add("featured");

            /* Update sidebar */

            const filterData = {
              bloom: {
                name: "Bloom AR",
                description: "Garden in your hands"
              },

              galaxy: {
                name: "Galaxy Hands",
                description: "Constellations from your hands"
              },

              pulse: {
                name: "Pulse",
                description: "Electric trails with movement"
              },

              butterfly: {
                name: "Butterfly Garden",
                description: "Summon a swarm of light"
              }
            };

            const data =
              filterData[effect];

            if (data) {

              const name =
                this.$("#activeFilterName");

              const description =
                this.$("#activeFilterDescription");

              if (name) {
                name.textContent =
                  data.name;
              }

              if (description) {
                description.textContent =
                  data.description;
              }
            }

            this.toast(
              `${data?.name || effect} activated ✦`
            );

            /* Go to studio */

            this.scrollTo("#studio");

          } catch (error) {

            console.error(
              "Effect switch failed:",
              error
            );

            this.toast(
              "Could not activate effect"
            );
          }
        });
      });


    /* ---------------- SCROLL BUTTONS ---------------- */

    document
      .querySelectorAll("[data-scroll]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {
            this.scrollTo(
              button.dataset.scroll
            );
          }
        );

      });


    /* ---------------- CAMERA ---------------- */

    this.$("#startBtn")
      ?.addEventListener(
        "click",
        () => app.toggleCamera()
      );


    /* ---------------- RESET ---------------- */

    this.$("#resetBtn")
      ?.addEventListener(
        "click",
        () => {
          app.reset();
          this.toast("Bloom reset ✦");
        }
      );


    /* ---------------- FULLSCREEN ---------------- */

    this.$("#fullscreenBtn")
      ?.addEventListener(
        "click",
        () => app.fullscreen()
      );


    /* ---------------- CAPTURE ---------------- */

    this.$("#captureBtn")
      ?.addEventListener(
        "click",
        () => app.capture()
      );


    /* ---------------- CAPTURE MODAL ---------------- */

    this.$("#closeCapture")
      ?.addEventListener(
        "click",
        () => this.closeCapture()
      );


    this.$("#closeCapture2")
      ?.addEventListener(
        "click",
        () => this.closeCapture()
      );


    this.$(".capture-backdrop")
      ?.addEventListener(
        "click",
        () => this.closeCapture()
      );


    /* ---------------- COMMENT COUNTERS ---------------- */

    const nameInput =
      this.$("#nameInput");

    const commentInput =
      this.$("#commentInput");


    nameInput?.addEventListener(
      "input",
      () => {
        this.$("#nameCount").textContent =
          `${nameInput.value.length}/24`;
      }
    );


    commentInput?.addEventListener(
      "input",
      () => {
        this.$("#commentCountInput").textContent =
          `${commentInput.value.length}/240`;
      }
    );


    /* ---------------- COMMENTS ---------------- */

    this.$("#commentForm")
      ?.addEventListener(
        "submit",
        e => {

          e.preventDefault();

          const name =
            nameInput.value.trim();

          const comment =
            commentInput.value.trim();

          if (!name || !comment) return;

          app.addComment(
            name,
            comment
          );

          nameInput.value = "";
          commentInput.value = "";

          this.$("#nameCount").textContent =
            "0/24";

          this.$("#commentCountInput").textContent =
            "0/240";
        }
      );
  }
}