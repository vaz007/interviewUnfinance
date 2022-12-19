import express from "express";
import { healthcheck } from "../controllers/healthcheck";
const router = express.Router();

router.get('/',healthcheck);

module.exports = router;