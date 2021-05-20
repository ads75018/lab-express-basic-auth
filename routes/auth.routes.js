
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

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

///Validation Part//
if (!username){
    res.render('auth/signup',{
        errorMessage: 'You need to have your coffee before you use this website. Please enter a real username'
    })
    return;
}

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
    .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.render('auth/signup', {errorMessage: err.message})
        } else if (err.code ===11000) {
            res.status(500).render('auth/signup', {
                errorMessage: 'Be unique.  Either username or email is already used.'
             });
           } else {
             next(err);
            
        }
    })
})

//LogIn//

router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
  
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
  
    User.findOne({ email })
      .then(userFromDb=> {
        if (!userFromDb) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcryptjs.compareSync(password, userFromDb.passwordHash)) {
            req.session.currentUser=userFromDb;
          res.render('users/userProfile', { user:userFromDb });
        } else {
          res.render('auth/login', { errorMessage: 'Wrong password.' });
        }
      })
      .catch(error => next(error));
  });
  
  // userProfile route and the module export stay unchanged
  
  router.get('/private', (req,res,next)=>{
      if (!req.session.currentUser){
          res.redirect('/login')
      }
      res.render('private',{
          user:req.session.currentUser
      })
    

  })

  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });


  //routemain
  router.get('/main', (req,res,next)=>{

    res.render('main',{
        
    })



module.exports = router;