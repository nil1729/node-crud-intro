if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const articleRouter = require('./routes/articles');
const Article = require('./models/Article');
const connectDB = require('./db/db');
const db = process.env.MONGO_URI;
connectDB(db);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.get('/', async (req, res) => {
	const articles = await Article.find().sort({ createdAt: 'desc' });
	res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, process.env.IP, () => {
	console.log(`Server started on port ${PORT}`);
});
