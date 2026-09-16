# Bloom AR

A modular browser-based hand-tracking AR playground.

## Run

Use VS Code Live Server (or any local static server) and open `index.html` from `localhost`.

Camera access generally requires a secure context such as `localhost` or HTTPS.

## Architecture

- `js/ar-core.js` — camera, MediaPipe, coordinate conversion and mirrored canvas rendering.
- `js/gesture-engine.js` — gesture classification and movement metrics.
- `js/effect-manager.js` — effect lifecycle and switching.
- `js/effects/bloom-effect.js` — the Bloom AR effect.
- `js/ui.js` — interface state and interaction helpers.
- `js/app.js` — application orchestration and local community storage.

## Adding a future filter

Create a class with `initialize`, `update`, `render`, optional `onGesture`, `reset`, and `destroy` methods. Register it in `app.js` with the `EffectManager`. The same hand landmarks and gesture engine can then drive the new effect.

## Notes

The app intentionally uses procedural canvas graphics instead of copied artwork. MediaPipe is loaded from jsDelivr at runtime; no API key or backend is required.
