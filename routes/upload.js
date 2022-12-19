import express from "express";
import {uploadCsv} from '../controllers/uploadCsv';

const router = express.Router();

router.post('/upload',uploadCsv)

module.exports = router;