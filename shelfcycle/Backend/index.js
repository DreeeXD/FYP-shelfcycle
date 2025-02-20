const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/Database.js')
const router = require('./routes/index.js')

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api", router)


const PORT = 8081 || process.env.PORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Connected to MongoDB')
        console.log(`Server is running at ${PORT}`)
    })
})

