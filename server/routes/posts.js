import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
/*READ*/

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/*UPDATE*/
router.patch("/:id/like", verifyToken, likePost);
/* DELETE */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Optionally, you can return the deleted post as a response
    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
