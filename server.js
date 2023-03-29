require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const giveMeAnswer = require('./utils/giveMeAnswer.js')
const { startMenu, mainMenu } = require('./constants/constants')

//==============================================

console.log('--------------- :>> ')

var previousMessages = [
    'rfr',
    `I'm sorry, but I'm not sure what you mean by "rfr". Could you please provide more information or context?`,
]

// var previousMessages = [
//     'Hi, I need help with my computer.',
//     'Sure, what seems to be the problem?',
// ]

//==============================================

function openStartMenu(chatId, startMenu) {
    bot.sendMessage(chatId, 'The keyboard is open', startMenu)
}

//==============================================

// bot.onText(/\/start/, (msg, match) => {
//     const chatId = msg.chat.id
//     console.log('111111 :>> ')
//     console.log('chatId :>> ', chatId)
//     // bot.sendMessage(chatId, 'Hello, ' + msg.chat.first_name + '!', mainMenu)

//     openStartMenu(chatId, startMenu)
// })

//==============================================

bot.onText(/\/start/, (msg) => {
    openStartMenu(msg.chat.id, startMenu)

    bot.sendMessage(msg.chat.id, 'Welcome', {
        reply_markup: {
            keyboard: [
                ['Sample text', 'Second sample'],
                ['Keyboard'],
                ["I'm robot"],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    })
})

//==============================================

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

//==============================================

// async function start() {
//     let answer = ''
//     let testPrompt = 'можешь прочитать предыдущее сообщение?'

//     answer = await giveMeAnswer(testPrompt, previousMessages)
//         .then((res) => res)
//         .catch((err) => {
//             console.log('err :>> _giveMeAnswer :  ', err)
//         })

//     console.log('answer :>> ', answer)
//     bot.sendMessage(chatIdAdmin, answer, mainMenu)
// }

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
