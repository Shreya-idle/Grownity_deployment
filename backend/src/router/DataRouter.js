import express from "express";
import { getCitiesByState } from "../controller/DataControl.js";

const router = express.Router();

router.get("/cities", getCitiesByState);

export default router;