const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/Database.js')
const router = require('./routes/index.js')
const cookieParser = require('cookie-parser')


const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json({ limit: '50mb' }));  // Increase JSON body size limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded body size limit
app.use(cookieParser())
app.use("/api", router)

const PORT = 8081 || process.env.PORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Connected to MongoDB')
        console.log(`Server is running at ${PORT}`)
    })
})

