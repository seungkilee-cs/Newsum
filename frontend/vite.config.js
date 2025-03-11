import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Newsum/", // Replace <repo-name> with your GitHub
  define: {
    "import.meta.env.VITE_APP_ENVIRONMENT": JSON.stringify(
      process.env.VITE_APP_ENVIRONMENT,
    ),
  },
});
