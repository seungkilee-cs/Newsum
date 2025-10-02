import express from "express";
import {
  getSites,
  createOrUpdateSites,
} from "../controllers/siteController.js";
import validateRequest from "../middleware/validateRequest.js";
import { siteArraySchema } from "../validators/siteSchemas.js";

const router = express.Router();

router.get("/", getSites);
router.post("/", validateRequest(siteArraySchema), createOrUpdateSites);

export default router;
