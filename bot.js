require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const giveMeAnswer = require('./utils/giveMeAnswer.js')
const bot_on_callback_query = require('./utils/bot_on_callback_query.js')
const {
    startAlwaysMenu_2buttons,
    callToAdminMenu,
    inline_keyboard,
} = require('./constants/menus')
const { textMessageHtml } = require('./constants/texts')

const arrayBlockListSendingGPT = [
    '/start',
    '/add_feature',
    '/clean_context',
    'Clean context',
    'Hello!',
]

console.log('__________________________________:>> ')

var previousMessages = []

// giveMeAnswer ==============================================

bot.on('message', async (msg) => {
    console.log('msg.text :>> ', msg.text)
    if (arrayBlockListSendingGPT.includes(msg.text) !== true) {
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

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        textMessageHtml,
        {
            parse_mode: 'HTML',
            //disable because we don't want show description links
            disable_web_page_preview: true,
        },
        startAlwaysMenu_2buttons,
    )
})

// callback_query
// //processing selections on the internal bot keyboard

bot.on('callback_query', (callbackQuery) => {
    console.log('callbackQuery ---------------:>> ', callbackQuery)
    console.log('55555_ :>>callback_query ')
    const data = callbackQuery.data
    if (data === 'clean_context') {
        bot.sendMessage(
            chatIdAdmin,
            'All was cleaned',
            startAlwaysMenu_2buttons,
            // inline_keyboard,
        )
    }
})

//===========================
//handler add_feature from BotFather

bot.onText(/\/add_feature/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Click the button to contact the administrator',
        callToAdminMenu,
    )
})

//==============================================
//processing selections on keyboard BotFather

bot.onText(/\/clean_context/, (msg) => {
    console.log('bot.onText conn_context/ :>> ')
    console.log('msg_____clean_context------- :>> ', msg)
    previousMessages = []

    bot.sendMessage(
        msg.chat.id,
        'Context was cleaned',
        startAlwaysMenu_2buttons,
        // inline_keyboard,
    )
    // bot.sendMessage(msg.chat.id, 'Context was cleaned')
})

// bot.on('callback_query', (callbackQuery) => {
//     const data = callbackQuery.data
//     if (data === 'button_pressed') {
//         console.log('111111111 :>>----------- ')
//     }
// })

// bot.on('callback_query', (query) => {

//     console.log('query11111 :>> ', query)
//     console.log('55555_ :>>callback_query ')

//     if (query.data === 'clean_context') {
//         console.log('query.data = clean_context :>> ')

//         bot.sendMessage(
//             chatIdAdmin,
//             'All was cleaned',
//             startAlwaysMenu_2buttons,
//             // inline_keyboard,
//         )
//     }
// })

// send message to admin with ask to add anything
bot.on('contact', (msg) => {
    bot.sendMessage(
        chatIdAdmin,
        `Message from ${msg.from.first_name}  :
         ${msg.contact.phone_number}`,
    )
})

module.exports = bot
