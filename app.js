require('dotenv').config()

var createError = require('http-errors')
var express = require('express')
var cors = require('cors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var timeout = require('connect-timeout')
const fileUpload = require('express-fileupload')
const i18n = require('i18n')

i18n.configure({
  locales: ['en', 'id'],
  directory: __dirname + '/locales',
  objectNotation: true,
})

const router = express.Router()
const {
  authRouter,
  userRouter,
  agentRouter,
  pMRouter,
  kreteriaRouter,
  pelamarRouter
} = require('./routes')
const { pMController } = require('./controllers')

var app = express()

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(timeout('30s'))
app.use(i18n.init)

router.use(function (req, res, next) {
  i18n.setLocale(res, req.query.lang || 'en')
  next()
})
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/agent', agentRouter)
router.use('/profilematching', pMRouter)
router.use('/kreteria', kreteriaRouter)
router.use('/pelamar', pelamarRouter)
app.use(process.env.PREFIX, router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  if (err.status == 503 || err.status == 404) {
    res.json({ success: false, message: err.message })
  } else {
    res.render('error')
  }
})

module.exports = app
