import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
    const newComment = new Comment({...req.body, userId: req.user.id})
    try {
        const savedComment = await newComment.save();
        res.status(200).send(savedComment)
    } catch (error) {
        next(err);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById(comment.videoid);

        if (req.user.id === comment.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id);
            return res.status(200).json("The comment has been deleted");
        } else {
            return next(createError(403, "You can delete only your account"));
        }
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(200).json(comments);
    } catch (error) {
        next(err);
    }
};