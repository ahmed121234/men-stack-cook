const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
// Routes/ API's/ Controller Functions
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken.')
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('password and confirm password must match')
    }

    encryption
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    const user = await User.create(req.body)
    res.send(`Thanks for signing up ${user.username}`)
  } catch (error) {
    console.log(error)
  }
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.send('Login failed. Please try again later.')
  }
})

const validPassword = bcrypt.compareSync(
  req.body.password,
  userInDatabase.password
)
if (!validPassword) {
  return res.send('Login failed. Please try again later.')
}

req.session.user = {
  username: userInDatabase.username,
  _id: userInDatabase._id
}

router.get('/sign-out', (req, res) => {
  console.log('here.')
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
