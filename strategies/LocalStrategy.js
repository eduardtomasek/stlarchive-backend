const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const { authenticate } = require('../models/user')

passport.use(new LocalStrategy((username, password, done) => {
    authenticate(username, password).then(user => {
        if (!user) {
            return done(null, false)
        } else {
            return done(null, user)
        }
    })
}))

passport.serializeUser((user, done) => done(null, user.id))