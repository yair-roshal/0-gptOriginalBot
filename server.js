const dotenv = require('dotenv')
dotenv.config()

const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN

const giveMeAnswer = require('./utils/giveMeAnswer.js')

// const textMessage = `<b>12345</b>`
// bot.sendMessage(chatIdAdmin, textMessage, {
//     parse_mode: 'HTML',
//     disable_web_page_preview: false,
// })

console.log('--------------- :>> ')
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id
    console.log('111111 :>> ')
    console.log('chatId :>> ', chatId)
    bot.sendMessage(chatId, 'Hello, ' + msg.chat.first_name + '!', mainMenu)
    openStartMenu(chatId)
})
function openStartMenu(chatId) {
    bot.sendMessage(chatId, 'The keyboard is open', startMenu)
}

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

// sending a list of words and adding them to the dictionary
bot.on('message', async (msg) => {
    const chatId = msg.chat.id

    console.log('3333 :>> ')
    console.log('chatId :>> ', chatId)
    console.log('msg :>> ', msg)
    let answer = ''
    await giveMeAnswer(msg.text)
        .then((res) => {
            answer = res
            return res
        })
        .catch((err) => {
            console.log('err :>> _giveMeAnswer :  ', err)
        })

    bot.sendMessage(chatId, answer)
})
