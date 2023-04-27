require('dotenv').config({ path: './.env' })

var bot = require('./Bot/bot')
require('./server/server')(bot)
