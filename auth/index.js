const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
    '/bungie/oauth',
    passport.authenticate('oauth2')
);

router.get('/user', (req, res) => {
    if(req.user) {
        return res.json({ user: req.user });
    } else {
        return res.json({ user: null });
    }
});

// callback when the authorization server (idp) provided an authorization code
router.get(
    '/bungie/callback',
    passport.authenticate('oauth2', {failureRedirect: 'http://localhost:3000/'}),
    function (req, res) {
        res.redirect('http://localhost:3000/dashboard');
    }
);
router.get('/bungie', (req,res) => {
    if(req.user) {
        return res.json({ user: req.user });
    } else {
        return res.json({ user: null });
    }
})

router.get('/bungie/logout', (req, res) => {
    console.log('asdasdas')
    if(req.user) {
        req.session.destroy();
        res.clearCookie('connect.sid');
    };
    res.json({ error: ''})
})

router.get('/bungie/error', (req,res) => {
    res.json({});
})

router.get('/', (req,res) => {
    
})
module.exports = router;