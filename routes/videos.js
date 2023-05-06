import express from "express";
import { verifyToken } from "../verifyToken.js";
import { addVideo, updateVideo, deleteVideo, getVideo, addView, trend, random, sub, getByTag, searchVideo } from "../controllers/video.js";

const router = express.Router();

// create a video
router.post("/", verifyToken, addVideo);

// update a video
router.put("/:id", verifyToken, updateVideo);

// delete a video
router.delete("/:id", verifyToken, deleteVideo);

// get a video
router.get("/find/:id", getVideo);

// increase the view counts
router.put("/view/:id", addView);

// trending videos
router.get("/trend", trend);

// random videos
router.get("/random", random);

// subscribed channel videos
router.get("/sub", verifyToken, sub);

// get video by tags
router.get("/tags", getByTag);

// search by title
router.get("/search", searchVideo);

export default router;