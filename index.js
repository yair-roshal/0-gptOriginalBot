require('dotenv').config()

var bot = require('./Bot/bot')
require('./server/server')(bot)
