import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_APP_ENVIRONMENT": JSON.stringify(
      process.env.VITE_APP_ENVIRONMENT,
    ),
  },
});
