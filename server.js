const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const app = express()
const mongoose = require('mongoose');
let {Schema} = mongoose
const PORT = process.env.PORT || 3000

const User = require('./models/user');


mongoose.connect('mongodb://localhost/auth_demo')

app.use(require('express-session')({
  secret: 'maya is the greatest',
  resave: false,
  saveUninitialized: false
}))

app.set('view engine', 'ejs')
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
passport.use(new LocalStrategy(User.authenticate()))

app.use(bodyParser.urlencoded({extended: true}))


//====ROUTES
app.get('/register', (req, res)=>{
  res.render('register')
})

app.post('/register', (req, res)=>{
User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
if(err){console.log(err);}
else {
  passport.authenticate('local')(req, res, ()=>{
    res.redirect('/secret')
  })
}
})
})

//Ligin Form
app.get('/login', (req, res)=>{
  res.render('login')
})

app.post('/login', passport.authenticate('local',
{successRedirect: '/secret',
failureRedirect: '/login',
}), (req, res)=>{

})

app.get('/', (req, res)=>{
  res.render('home')
})

let isLoggedIn = (req, res, next) =>{
if(req.isAuthenticated()){
  return next()
}
res.redirect('/login')
}

app.get('/secret', isLoggedIn, (req, res)=>{
  res.render('secret')
})

app.get('/logout', (req, res)=>{
req.logout()
res.redirect('/')
})



app.listen(PORT, ()=>{
  console.log(`Server on port: ${PORT}`);
})
