import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.get("/user/userName", protectedRoute, getUserPosts);
router.post("/create", protectedRoute, createPost);
router.delete("/:id", protectedRoute, deletePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);

export default router;
