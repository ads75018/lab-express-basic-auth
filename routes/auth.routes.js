
const express = require('express')
const router = express.Router()

const User = require('../models/User.model')
const bcryptjs = require('bcryptjs');
const salt = bcryptjs.genSaltSync(10)

router.get('/signup', function(req, res, next){
    res.render('auth/signup', {})
})

router.post('/signup', function (req, res, next){
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    // const { username, email, password } = req.body;
    console.log(password)

    const passwordHashed = bcryptjs.hashSync(password, salt)

    User.create({
        username: username,
        email: email, 
        passwordHash: passwordHashed
    })
    .then(function(userFromDb){
        res.redirect('/')
    })
    .catch(err => next(err))
})




module.exports = router;