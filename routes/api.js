const express = require("express");
const router = express.Router();

const feedController = require("../controllers/feed");

//router.get("/post", feedController.getPosts);
router.post("/posts", res.status(201).json({
    message: "success operation",
    post: {
        id: "something",
        title: "is",
        description: "sent"
    }
})
);


module.exports = router;