const express = require('express');
const router = express.Router();
const Article = require('./../models/Article');
const slugify = require('slugify');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window);


router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

router.get('/:slug', async(req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        res.render('articles/show', { article: article });
    } catch (e) {
        console.error('Could not Find');
        res.redirect('/');
    }

});

router.post('/', async(req, res) => {
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        slug: slugify(req.body.title, {
            strict: true,
            lower: true
        }),
        README: dompurify.sanitize(marked(req.body.markdown))
    });
    try {
        const duplicates = await Article.findOne({ slug: article.slug });
        if (duplicates === null) {
            try {
                article = await article.save();
                res.redirect(`/articles/${article.slug}`);
            } catch (e) {
                console.log(e);
                console.log(`Doesn't Save`);
                res.render('articles/new', { article: article });
            }
        } else {
            return res.render('articles/new', { article: article });
        }
    } catch (e) {
        console.log(e);
    }
});


router.delete('/:id', async(req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.get('/edit/:id', async(req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('articles/edit', { article: article });
    } catch (e) {
        res.redirect('/');
    }

});

router.put('/edit/:id', async(req, res) => {
    let updatedArticle = {
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        slug: slugify(req.body.title, {
            strict: true,
            lower: true
        }),
        README: dompurify.sanitize(marked(req.body.markdown)),
        createdAt: new Date()
    };
    try {
        const duplicates = await Article.findOne({ slug: updatedArticle.slug });
        if (duplicates === null) {
            try {
                await Article.findByIdAndUpdate(req.params.id, updatedArticle);
                res.redirect(`/articles/${updatedArticle.slug}`);
            } catch (e) {
                console.log(e);
                console.log(`Doesn't Save`);
                res.redirect(`/articles/${updatedArticle.slug}`);
            }
        } else {
            return res.redirect(`/articles/${updatedArticle.slug}`);
        }
    } catch (e) {
        return res.redirect(`/articles/${updatedArticle.slug}`);
    }

});

module.exports = router;