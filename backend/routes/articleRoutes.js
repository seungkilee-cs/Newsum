import express from "express";
import {
  receiveArticles,
  getArticles,
  receiveMongoArticles,
  getMongoArticles,
  testMongo,
} from "../controllers/articleController.js";

const router = express.Router();

router.post("/receive", receiveArticles);
router.get("/", getArticles);
router.post("/mongo-receive", receiveMongoArticles);
router.get("/mongo", getMongoArticles);
router.get("/test-mongo", testMongo);

export default router;
