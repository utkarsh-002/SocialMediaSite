const router =  require("express").Router();
const { default: mongoose } = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

//update a post
router.put("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId==req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("Updated!!");
        }else{
            res.status(403).json("You can only upadate your posts!!")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete a post
router.delete("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId==req.body.userId){
            await post.deleteOne();
            res.status(200).json("Deleted!!");
        }else{
            res.status(403).json("You can only delete your posts!!")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//like or dislike a post
router.put("/:id/like",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("liked!!");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("disliked!!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
//react or unreact  a heart
router.put("/:id/heart",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.heart.includes(req.body.userId)){
            await post.updateOne({$push:{heart:req.body.userId}});
            res.status(200).json("heart");
        }else{
            await post.updateOne({$pull:{heart:req.body.userId}});
            res.status(200).json("unreact");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//get a post
router.get("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        post? res.status(200).json(post) : res.status(403).json("Post not found!!");
    } catch (error) {
       res.status(500).json(error); 
    }
});

//get timeline posts
router.get("/timeline/:id",async (req,res)=>{
    try {
        const currUser = await User.findById(req.params.id);
        const userPosts = await Post.find({userId:currUser._id});
        const friendPosts = await Promise.all(
            currUser.following.map((friendId)=>{
               return Post.find({userId:friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
       res.status(500).json(error); 
       console.log(error);
    }
});

//fetch posts using username
router.get("/profile/:username",async (req,res)=>{
    try {
        const user = await User.findOne({username:req.params.username});
        const posts = await Post.find({userId:user._id});
        res.status(200).json(posts);
    } catch (error) {
       res.status(500).json(error); 
    }
});


module.exports = router;