const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const authRoutes = require('./routes/auth')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT

//middlewares
app.use(express.json())
app.use(cors())
app.use('/api/v1/auth', authRoutes)

//routes
readdirSync('./routes').map((route) => {
    if (route !== 'auth.js') app.use('/api/v1', require('./routes/' + route))
});

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()