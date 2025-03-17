import articleRoutes from "./articleRoutes.js";
import siteRoutes from "./siteRoutes.js";
import userRoutes from "./userRoutes.js";

export default function (app) {
  app.use("/api/articles", articleRoutes);
  app.use("/api/sites", siteRoutes);
  app.use("/api/users", userRoutes);
}
