import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser');
      return worker.start({
        onUnhandledRequest: 'bypass',
      });
    } catch (error) {
      console.warn('Failed to start MSW:', error);
    }
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch(() => {
  // Ensure app renders even if MSW fails
  createRoot(document.getElementById("root")!).render(<App />);
});
