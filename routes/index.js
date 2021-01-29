const authRouter = require('./auth')
const agentRouter = require('./agent')
const pMRouter = require('./profilematching')
const kreteriaRouter = require('./kreteria')
const userRouter = require('./user')
const pelamarRouter = require('./pelamar')
module.exports = {
  authRouter,
  agentRouter,
  pMRouter,
  kreteriaRouter,
  userRouter,
  pelamarRouter
}