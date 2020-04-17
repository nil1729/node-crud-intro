const express = require('express'),
    methodOverride = require('method-override'),
    app = express(),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose');
// To view EJS files without extension
app.set('view engine', 'ejs');
//  To use Externel Files on Public Directory
app.use(express.static("public"));
//  Use The Body Parser to read the data Coming from the "FORM"
app.use(bodyParser.urlencoded({ extended: true }));
// Use Sanitizer
app.use(expressSanitizer());
// Use Method-Override
app.use(methodOverride("_method"));

// MongoDB Connect
mongoose.connect("mongodb://localhost/restful_blog_app", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connected To DataBase..."))
    .catch(err => console.log("Refuse to Connect...", err));
// Create Schema for Blogs
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});
// Crete Model For Blogs
var Blog = mongoose.model("Blog", blogSchema);
// RESTful Routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
// Index Route {GET}
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Something Went Wrong!");
            console.log(err);
        } else {
            res.render('index', { blogs: blogs });
        }
    });
});
// New Route
app.get('/blogs/new', (req, res) => {
    res.render('new');
});
// Create Route
app.post('/blogs', (req, res) => {
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});
// Show Route
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});
// Edit Route 
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', { blog: foundBlog });
        }
    });
});
// Update Route {PUT HTTPs}
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            console.log("Something Went Wrong");
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});
// Delete Blog {delete HTTPs}
app.delete('/blogs/:id', (req, res) => {
    // Destroy Blog
    Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
        if (err) {
            console.log("Something Went Wrong!");
        } else { // Redirect somewhere
            res.redirect('/blogs');
        }
    });

});
// 404 Not Found
app.get('*', (req, res) => {
    res.redirect('/blogs');
});
// App listen or Server hosting
app.listen(3000, () => {
    console.log(`Server started on port`);
});