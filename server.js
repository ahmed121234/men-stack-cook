const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const isSignedIn = require('./middleware/is-signed-in.js')
const app = express()

const passUserToView = require('./middleware/pass-user-to-view.js')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const router = require('express').Router()

const port = process.env.PORT ? process.env.PORT : '3000'
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use(passUserToView)

const authControl = require('./controllers/auth.js')
const recipesControl = require('./controllers/recipes.js')
const ingredientsControl = require('./controllers/ingredients.js')

app.use('/auth', authControl)
app.use('/recipes', recipesControl)
app.use('/ingredients', ingredientsControl)

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})
