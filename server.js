const _ = require('lodash')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const jwt = require("jsonwebtoken")

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/**
 * STRATEGIES
 */
require('./strategies/JwtStrategy')
require('./strategies/LocalStrategy')
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("./authenticate")

/**
 * EXPRESS
 */
const app = express()

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

// CORS
const whiteList = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : []

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error(`${origin} not allowed in CORS!`))
        }
    },
    credentials: true
}

app.use(cors(corsOptions))
app.use(passport.initialize())


/**
 * MODELS
 */
const users = require('./models/user')

/**
 * ROUTES
 */
app.get('/', (req, res) => {
    res.send({
        ok: true,
    })
})

app.post('/login', passport.authenticate('local'), (req, res, next) => {
    const token = getToken({ _id: req.user.id })
    const refreshToken = getRefreshToken({ _id: req.user.id })

    users.storeRefreshToken(req.user.id, refreshToken).then(data => {
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
        res.send({
            ok: true,
            token,
            refreshToken,
        })
    }).catch(e => {
        res.statusCode = 500
        res.send(e)
    })
})

app.post('/refreshToken', (req, res, next) => {
    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    if (refreshToken) {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userId = payload._id

        users.getUser(userId).then(user => {
            if (user) {
                users.getRefreshToken(userId, refreshToken).then(token => {
                    if (token) {
                        const token = getToken({ _id: userId })
                        const newRefreshToken = getRefreshToken({ _id: userId })

                        users.storeRefreshToken(userId, newRefreshToken).then(data => {
                            res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS)
                            res.send({
                                ok: true,
                                token,
                                refreshToken: newRefreshToken,
                            })
                        })
                    } else {
                        res.status = 401
                        res.send('Unauthorized')
                    }
                })
            } else {
                res.status = 401
                res.send('Unauthorized')
            }
        })
    } else {
        res.status = 401
        res.send('Unauthorized')
    }
})

app.get('/logout', verifyUser, (req, res, next) => {
    console.log({ signedCookies: req.signedCookies })

    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies

    users.getUser(req.user.id).then(user => {
        users.getRefreshToken(user.id, refreshToken).than(token => {
            if (token) {
                users.deleteRefreshToken(token.id).then(data => {
                    res.clearCookie('refreshToken', COOKIE_OPTIONS)
                    res.send({ ok: true })
                })
            }
        })
    })
})

app.get('/me', verifyUser, (req, res, next) => {
    res.send(req.user)
})

const server = app.listen(process.env.PORT || 3333, () => {
    console.log(`Example app listening on PORT ${server.address().port}`)
})
