require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token =
    process.env.NODE_ENV === 'prod'
        ? process.env.TELEGRAM_BOT_TOKEN
        : process.env.TELEGRAM_BOT_TOKEN_testing
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const giveMeAnswer = require('./utils/giveMeAnswer.js')
const formatDate = require('./utils/formatDate.js')
// const bot_on_callback_query = require('./utils/bot_on_callback_query.js')

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

var previousMessages = {}
const timestamp = Date.now()
const formattedDate = formatDate(timestamp)
console.log('bot started__________________________________:>> ', formattedDate)

console.log('process.env.NODE_ENV :>> ', process.env.NODE_ENV)

// giveMeAnswer ==============================================
bot.on('message', async (msg) => {
    console.log('msg.text :>> ', msg.text)
    if (arrayBlockListSendingGPT.includes(msg.text) !== true) {
        const chatId = msg.chat.id
        const msgLangCode = msg.from.language_code
        let prompt = msg.text
        let answer = ''
        previousMessagesUserId = previousMessages[chatId] || []

        bot.sendChatAction(chatId, 'typing')

        const tempMessage =
            msgLangCode === 'ru'
                ? 'Пожалуйста, подождите немного, пока чатбот ответит на ваш запрос...'
                : msgLangCode === 'he'
                ? 'אנא המתן רגע בזמן שהבוט יגיב לבקשתך...'
                : 'Please wait a moment while the chatbot responds to your query . . .'
        let tempMsgId
        bot.sendMessage(chatId, tempMessage).then((tempMsg) => {
            tempMsgId = tempMsg.message_id
        })

        answer = await giveMeAnswer(prompt, previousMessagesUserId)
            .then((res) => res)
            .catch((err) => {
                console.log('err :>> _giveMeAnswer :  ', err)
            })

        bot.sendMessage(chatId, answer).then(() => {
            // удаляем временное сообщение
            bot.deleteMessage(chatId, tempMsgId)
        })

        const timestamp = Date.now()
        const formattedDate = formatDate(timestamp)

        //====================
        let loggingObj = {
            Date: formattedDate,
            firstName: msg.from.first_name,
            username: msg.from.username,
            prompt: prompt,
            context: previousMessagesUserId,
            answer: answer,
        }

        console.log(loggingObj)
        //====================

        //=========
        bot.sendMessage(
            chatIdAdmin,
            JSON.stringify(loggingObj, ['\n', '  '], 2),
        )
        //====================
        previousMessages[chatId] = previousMessages[chatId] || []
        previousMessages[chatId].push(prompt)
    }
})

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id

    bot.sendMessage(
        chatId,
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
    const chatId = msg.chat.id

    bot.sendMessage(
        chatId,
        'Click the button to contact the administrator',
        callToAdminMenu,
    )
})

//==============================================
//processing selections on keyboard BotFather

bot.onText(/\/clean_context/, (msg) => {
    const chatId = msg.chat.id

    console.log('bot.onText conn_context/ :>> ')
    console.log('msg_____clean_context------- :>> ', msg)
    previousMessages[chatId] = []

    bot.sendMessage(
        chatId,
        'Context was cleaned',
        startAlwaysMenu_2buttons,
        // inline_keyboard,
    )
    // bot.sendMessage(chatId, 'Context was cleaned')
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
