const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ], 
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'comment_text'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbblogData => {
        const blogs = dbblogData.map(post => post.get({ plain: true }));
        res.render('homepage', { blogs, loggedIn: req.session.loggedIn });
    }
    )
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

    router.get('/post:id', (req, res) => {
        Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'comment_text'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbblogData => {
            if (!dbblogData) {
                res.status(404).json({ message: 'Nothing found' });
                return;
            }
            const blog = dbblogData.get({ plain: true });
            res.render('single-post', { blog, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
    )
    router.get('/login', (req, res) => {
        if (req.session.loggedIn) {
            res.redirect('/');
            return;
        }
        res.render('login');
    }
    )
    router.get('/signup', (req, res) => {
        if (req.session.loggedIn) {
            res.redirect('/');
            return;
        }
        res.render('signup');
    }
    )

    router.get('*', (req, res) => {
        res.status(404).send('404 Error!');
    }  
    )   
})
module.exports = router;