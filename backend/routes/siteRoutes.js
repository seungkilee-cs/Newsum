import express from "express";
import {
  getSites,
  createOrUpdateSites,
} from "../controllers/siteController.js";

const router = express.Router();

router.get("/", getSites);
router.post("/", createOrUpdateSites);

export default router;
