const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt

const { getUser } = require('../models/user')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        getUser(jwt_payload._id).then(user => {
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
    })
)