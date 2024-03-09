const express = require('express');
const Post = require ('../models/post');
const crypto = require("crypto");
const multer = require('multer'); // Allows to save images

const router = express.Router();
const posts = [
    { _id: 'dsasrerdsf', 
    title: 'First server-side post', 
    content: 'This is coming from the server',
    imagePath: 'http://localhost:3000/images/Venezia.jpeg'
    },
    { _id: 'wsaasdardsf', 
    title: 'Second server-side post', 
    content: 'This is coming from the server',
    imagePath: 'http://localhost:3000/images/Venezia.jpeg'
    }
];

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        } // if
        callback(error, "backend/images"); // The path is relative (where is the server.js file)
    },
    filename: (request, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + extension);
    }
});

router.post ("/api/posts");

router.post ("", multer ({ storage: storage }).single ("image"), (request, response, next) => {
    const url = request.protocol + '://' + request.get ("host");
    const createdPost = {
        _id: crypto.randomBytes(16).toString("hex"),
        title: request.body.title, // body was added by bodyParser
        content: request.body.content,
        imagePath: url + "/images/" + request.file.filename
    };

    console.log (createdPost);

    posts.push (createdPost);

    /* // With MongoDB
    const post = new Post ({
        _id: request.body.title,
        title: request.body.title, // body was added by bodyParser
        content: request.body.content
    });

    post.save ()  // Moongose will save datas on MongoDB
        .then (createdPost => { 
            response.status (201).json ({
                message: 'Post added succesfully',
                post: {
                    id: createdPost._id,
                    title: createdPost.title,
                    content: createdPost.content,
                    imagePath: createdPost.imagePath
                }
            });
        }); */

    response.status (201).json ({
        message: 'Post added succesfully',
        post: {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath
        }
    });
});

router.put ("/:id", multer ({ storage: storage }).single ("image"), (request, response, next) => { // put replace, patch update
    let imagePath = request.body.imagePath;
    if (request.file) {
        const url = request.protocol + '://' + request.get ("host");
        imagePath = url + "/images/" + request.file.filename;
    } // if

    const postToFind = posts.find (post => post._id === request.params.id);
    posts.splice (posts.indexOf (postToFind), 1);

    const post = new Post ({
        _id: request.params.id,
        title: request.body.title,
        content: request.body.content,
        imagePath: imagePath
    });

    posts.push (post);

    // With MongoDB
    /* 
    Post.updateOne ({ _id: request.params.id }, post).then (result => {
        response.status(200).json ({message: 'Update successful'});
    }); */

    response.status (200).json ({
        message: 'Update successful',
    });
});

router.get ('', (request, response, next) => {
    const pageSize = +request.query.pagesize;
    const currentPage = +request.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    // Send back a response
    /* response.send ('Hello from express!'); */

    // With MongoDB
    // Fetch only a part of the posts
    /* if (pageSize && currentPage) {
        postQuery
            .skip (pageSize * (currentPage + 1))
            .limit (pageSize) // Limit the amount of documents to return
    } // if
    postQuery.then (documents => {
        fetchedPosts = documents;
        return Post.count ()
    }).then (count => {
        response.status (200).json ({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count
        })
    }); */

    const postsToSkip = pageSize * (currentPage -1);
    const offset = postsToSkip !== 0 ? 1 : 0;
    const subPost = posts.slice (postsToSkip, posts.length > pageSize + offset ? pageSize : posts.length);

    // No need to add return statment
    response.status (200).json ({
        message: 'Posts fetched succesfully',
        posts: subPost,
        maxPosts: subPost.length
    });
});

router.get ("/:id", (request, response, next) => {
    // With MongoDB
    /* Post.findById (request.params.id).then (post => {
        if (post) {
            response.status(200).json (post);
        } else {
            response.status(404).json ({message: "Post not found"});
        } // if - else
    }); */

    const postToFind = posts.find (post => post._id === request.params.id);
    if (postToFind) {
        response.status(200).json (postToFind);
    } else {
        response.status(404).json ({message: "Post not found"});
    } // if - else
});

router.delete ("/:id", (request, response, next) => {
    // With MongoDB
    /* Post.deleteOne ({ _id: request.params.id }).then (result => {
        console.log (result);
        response.status(200).json ({message: "Post deleted"});
    }) */

    const postIndexToDelete = posts.findIndex (post => post.id === request.params.id);
    posts.splice (postIndexToDelete, 1);

    response.status(200).json ({message: "Post deleted"});
});

module.exports = router;