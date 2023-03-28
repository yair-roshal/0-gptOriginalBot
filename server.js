require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const giveMeAnswer = require('./utils/giveMeAnswer.js')
const { mainMenu } = require('./constants/constants')

//==============================================

console.log('--------------- :>> ')

var previousMessages = [
    'Hi, I need help with my computer.',
    'Sure, what seems to be the problem?',
]

let prompt = 'how can i fix my mind'

async function start() {
    let answer = ''

    answer = await giveMeAnswer(prompt, previousMessages)
        .then((res) => res)
        .catch((err) => {
            console.log('err :>> _giveMeAnswer :  ', err)
        })

    console.log('answer :>> ', answer)
    bot.sendMessage(chatIdAdmin, answer, mainMenu)
}

// start()
//==============================================

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    console.log('msg :>> ', msg)

    let prompt = msg.text

    let answer = ''

    answer = await giveMeAnswer(prompt, previousMessages)
        .then((res) => res)
        .catch((err) => {
            console.log('err :>> _giveMeAnswer :  ', err)
        })

    console.log('answer :>> ', answer)
    bot.sendMessage(chatId, answer)
})
//==============================================

function openStartMenu(chatId, startMenu) {
    bot.sendMessage(chatId, 'The keyboard is open', startMenu)
}

//==============================================

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id
    console.log('111111 :>> ')
    console.log('chatId :>> ', chatId)
    // bot.sendMessage(chatId, 'Hello, ' + msg.chat.first_name + '!', mainMenu)
    openStartMenu(chatId, startMenu)
})

bot.onText(/\/keyboard/, (msg) => {
    const chatId = msg.chat.id
    console.log('22222 :>> ')
    console.log('chatId :>> ', chatId)
    bot.sendMessage(msg.chat.id, 'Alternative keyboard layout', mainMenu)
})

bot.on('callback_query', (query) => {
    console.log('55555_ :>>callback_query ')

    if (query.data === 'development') {
        bot.sendMessage(chatIdAdmin, 'development menu', mainMenu)
    }
    if (query.data === 'lifestyle') {
        bot.sendMessage(chatIdAdmin, 'lifestyle menu', mainMenu)
    }
    if (query.data === 'other') {
        bot.sendMessage(chatIdAdmin, 'other menu', mainMenu)
    }
})
