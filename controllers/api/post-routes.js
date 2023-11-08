const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//we need the blog posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [{
            model: User, 
            attributes: ['username']
        }, 
        {
            model: Comment, 
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User, 
                attributes: ['username']
            }
        }]
    })
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
}
);

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id, 
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [{
            model: User, 
            attributes: ['username']
        },
        {
            model: Comment, 
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User, 
                attributes: ['username']
            }
        }]
        }
    )  
    .then(dbBlogData => {
        if (!dbBlogData) {
            res.status(404).json({ message: 'None found' });
            return;
        }
        res.json(dbBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
router.post('/', withAuth, (req, res) => {
    console.log("making blog post...");
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })

}
);
});



module.exports = router;