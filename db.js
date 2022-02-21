const postgreLib = require('pg')
const pgp = require('pg-promise')()
postgreLib.defaults.poolSize = process.env.DATABASE_CONNECTIONS || 5

const db = pgp(process.env.PG_CONN_STRING)

module.exports = {
    db,
}