const Blog = require('../models/blog');
const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary');

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
module.exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
    
        if (blogs) {
            res.json(blogs)
        } else {
            return res.status(404).json({ message: 'No blogs found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
};

// @desc    Fetch one blog
// @route   GET /api/blogs/:id
// @access  Public
module.exports.getBlogById = async(req, res) =>{
    const { id } = req.params;
    try {
        if (mongoose.Types.ObjectId.isValid(id)) {
            const blog = await Blog.findById(id)

            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' })
            } else {
                res.json(blog)
            }

        } else {
            return res.status(404).json({ message: 'Invalid Blog ID' })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }

}

// @desc    Create a Blog 
// @route   POST /api/blogs
// @access  Private
module.exports.createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        if(!req.file){
            newBlog.image = {
                "url": "https://res.cloudinary.com/ddxxsib3q/image/upload/v1632515648/myblog2021/ty46lqzalcvfh8e0u5zi.jpg",
                "filename": "myblog2021/ty46lqzalcvfh8e0u5zi"
             }
        } else{
            newBlog.image = {url: req.file.path, filename: req.file.filename} 
        }
        // newBlog.author = req.user._id;
         await newBlog.save();    
        res.status(201).json(newBlog)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
};

// @desc    Update a Blog 
// @route   PUT /api/blogs/:id
// @access  Private
module.exports.updateBlog = async(req, res)=>{
    const {id} = req.params;
    try {
        const blog = await Blog.findById(id)

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' })
        } else {
            let updatedBlog = {}
            if(req.body.blog){
                updatedBlog = req.body.blog;
            }           
            if(req.file){
                updatedBlog.image = {url: req.file.path, filename: req.file.filename};
            }
            const savedUpdatedBlog = await Blog.findByIdAndUpdate(id, updatedBlog, {new: true});
            return res.json(savedUpdatedBlog)
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
module.exports.deleteBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    try {
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' })
        } else {
            await blog.remove()
            res.json({ message: 'Blog Removed!' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }

}
