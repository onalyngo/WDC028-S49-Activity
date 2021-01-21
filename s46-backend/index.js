const express = require('express')
const app = express()
//configure dotenv to manage environment variables
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const port = process.env.PORT
const mongodbCloud = process.env.DB_MONGODB

//add whitelisted origins here
const corsOptions = {
	origin: ['http://localhost:3000'],
	optionsSuccessStatus: 200//for compatibility with older browsers
}

/*
const corsOptions = {
	origin: process.env.WHITELISTED_SOURCES.spliet(' '),
	optionsSuccessStatus: 200//for compatibility with older browsers
}
WHITELISTED_SOURCES = "http://localhost:3000 https://www.google.com"
WHITELISTED_SOURCES = ["http://localhost:3000", "https://www.google.com"]

app.use(cors());
*/

mongoose.connection.once('open', () => console.log('Now connected to MongoDB cloud.'))
mongoose.connect(mongodbCloud, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
})

app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({ extended: true }))

const userRoutes = require('./routes/user')

//use cors as a middleware passing in options
app.use('/api/users', cors(corsOptions), userRoutes)

app.listen(port, () => {
    console.log(`API is now online on port ${ port }`)
})