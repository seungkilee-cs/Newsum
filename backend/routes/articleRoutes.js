import express from "express";
import {
  receiveArticles,
  getArticles,
  receiveMongoArticles,
  getMongoArticles,
  testMongo,
} from "../controllers/articleController.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  articleArraySchema,
} from "../validators/articleSchemas.js";

const router = express.Router();

router.post("/receive", validateRequest(articleArraySchema), receiveArticles);
router.get("/", getArticles);
router.post(
  "/mongo-receive",
  validateRequest(articleArraySchema),
  receiveMongoArticles,
);
router.get("/mongo", getMongoArticles);
router.get("/test-mongo", testMongo);

export default router;
