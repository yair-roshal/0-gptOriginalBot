require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const giveMeAnswer = require('./utils/giveMeAnswer.js')
const {
    startAlwaysMenu_2buttons,
    callToAdminMenu,
} = require('./constants/constants')

//==============================================

console.log('__________________________________:>> ')

var previousMessages = []

//===========================
//handler add_feature from BotFather

bot.onText(/\/add_feature/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Click the button to contact the administrator',
        callToAdminMenu,
    )
})

//
bot.on('contact', (msg) => {
    bot.sendMessage(
        chatIdAdmin,
        `Message from ${msg.from.first_name}  :
         ${msg.contact.phone_number}`,
    )
})

bot.onText(/\/text (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const text = match[1]

    bot.sendMessage(chatId, text)
})

//==============================================
//processing selections on   keyboard BotFather

bot.onText(/\/clean_context/, (msg) => {
    console.log('bot.onText conn_context/ :>> ')
    console.log('msg_____clean_context------- :>> ', msg)
    previousMessages = []

    bot.sendMessage(
        msg.chat.id,
        'Context was cleaned',
        // startMenu,
        // mainMenu,
        startAlwaysMenu_2buttons,
    )
    // bot.sendMessage(msg.chat.id, 'Context was cleaned')
})

//==============================================
//processing selections on the internal bot keyboard
bot.on('callback_query', (query) => {
    console.log('query11111 :>> ', query)
    console.log('55555_ :>>callback_query ')

    if (query.data === 'clean_context') {
        bot.sendMessage(
            chatIdAdmin,
            'All was cleaned',
            startAlwaysMenu_2buttons,
        )
    }
})

//==============================================
//giveMeAnswer

bot.on('message', async (msg) => {
    console.log('msg.text :>> ', msg.text)
    if (['/add_feature', '/clean_context'].includes(msg.text) !== true) {
        const chatId = msg.chat.id

        let prompt = msg.text

        let answer = ''

        answer = await giveMeAnswer(prompt, previousMessages)
            .then((res) => res)
            .catch((err) => {
                console.log('err :>> _giveMeAnswer :  ', err)
            })

        console.log('answer :>> ', answer)
        bot.sendMessage(chatId, answer)
    }
})
