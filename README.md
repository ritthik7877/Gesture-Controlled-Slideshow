# Gesture Room

A frontend-only slideshow controlled by keyboard or hand gestures. The app uses React, Vite, TypeScript, Tailwind CSS, and MediaPipe Hand Landmarker; webcam video and hand landmarks stay in the browser.

## Setup

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`). Camera permissions work on `localhost` and on HTTPS origins. The first hand-tracker startup downloads the MediaPipe model and WASM runtime.

## Gestures

| Gesture | Action |
| --- | --- |
| Swipe left | Next slide |
| Swipe right | Previous slide |
| Hold an open palm for 1 second | Toggle fullscreen |
| Hold a closed fist for 1 second | Return to slide 1 |
| Pinch and move your fingers | Zoom the current slide image |

Use the **← / →** keys or the on-screen arrows as a keyboard fallback. Gesture control, camera access, swipe sensitivity, and cooldown are adjustable in Quick Settings. Gesture triggers have an 800 ms default cooldown.

## System architecture

Gesture Room is a browser-only React application. `AppProvider` holds the current slide and gesture settings; `GestureDeck` connects the slideshow, webcam, tracker, and gesture recognizer. MediaPipe processes the camera stream locally, while the model/WASM files and slide images are downloaded from their configured external URLs. There is no application backend.

See [docs/README.md](./docs/README.md) for the component overview and data-flow diagram.

## Troubleshooting

- **Camera permission denied:** Allow camera access for this site in your browser settings, then retry from the webcam preview or turn the camera off and on.
- **No camera found / camera is busy:** Connect a webcam and close other apps using it. Keyboard navigation remains available.
- **Camera access unavailable:** Browsers generally require a secure context: use `localhost` for local development or serve the app over HTTPS.
- **Hand tracker stays loading or errors:** Wait for the first model download to finish, check network access to the MediaPipe CDN and Google-hosted model, then reload.
- **Camera toggle is off:** Turn it on in Quick Settings to start the webcam and hand tracker.

## Commands

```powershell
npm.cmd run dev       # Start the Vite development server
npm.cmd run test      # Run gesture utility tests
npm.cmd run build     # Type-check and create a production build
npm.cmd run preview   # Preview the production build
```
