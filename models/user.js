const { db } = require('../db')

function getUser (id) {
    return db.oneOrNone(`SELECT id, uuid, login FROM public.users WHERE id = $[id] LIMIT 1`, { id })
}

function authenticate (login, password) {
    return db.oneOrNone(`SELECT id, uuid, login FROM public.users WHERE login = $[login] AND "password" = $[password] LIMIT 1`, { login, password })
}

function storeRefreshToken (userId, token) {
    return db.query(`INSERT INTO users_tokens (user_id, token) VALUES ($[userId], $[token])`, { userId, token })
}

function getRefreshToken (userId, token) {
    return db.oneOrNone(`SELECT id FROM users_tokens WHERE user_id = $[userId] AND token = $[token]`, { userId, token })
}

function deleteRefreshToken (id) {
    return db.query(`DELETE FROM users_tokens WHERE id = $[id]`, { id })
}

module.exports = {
    getUser,
    authenticate,
    storeRefreshToken,
    getRefreshToken,
    deleteRefreshToken,
}