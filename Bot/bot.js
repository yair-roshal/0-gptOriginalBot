require('dotenv').config({ path: '../.env' })
const TelegramBot = require('node-telegram-bot-api')
const token =
    process.env.NODE_ENV === 'prod'
        ? process.env.TELEGRAM_BOT_TOKEN
        : process.env.TELEGRAM_BOT_TOKEN_testing

console.log('token :>> ', !!token)
console.log(
    'process.env.TELEGRAM_BOT_TOKEN :>> ',
    process.env.TELEGRAM_BOT_TOKEN,
)
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const giveMeAnswer = require('../utils/giveMeAnswer.js')
const formatDate = require('../utils/formatDate.js')

const {
    startAlwaysMenu_2buttons,
    callToAdminMenu,
    clean_context,
    keyboardSubscribeButton,
} = require('../constants/menus.js')
const {
    textMessageHtml,
    link_to_channel,
    text_to_subscribe,
} = require('../constants/texts.js')

const arrayBlockListSendingGPT = [
    '/start',
    '/about',
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

var optionHTML = {
    // reply_markup: JSON.stringify(clean_context),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
}

var optionSubscribeButton = {
    reply_markup: JSON.stringify(keyboardSubscribeButton),
    parse_mode: 'HTML',
    // disable_web_page_preview: true,
}

bot.sendMessage(
    chatIdAdmin,
    'server started - let start bot  /start',
    optionHTML,
)

bot.onText(/\/start/, async (msg) => {
    console.log('/start :>> ')
    const chatId = msg.from.id

    let link_to_channel = '@originalBotNewsAI'

    bot.getChatMember(link_to_channel, chatId)
        .then((chatMember) => {
            if (
                chatMember.status === 'member' ||
                chatMember.status === 'administrator' ||
                chatMember.status === 'creator'
            ) {
                bot.sendMessage(chatId, textMessageHtml, optionHTML)
                // bot.sendMessage(chatId, 'Welcome to the bot!')
            } else {
                bot.sendMessage(
                    chatId,

                    text_to_subscribe,
                    optionSubscribeButton,
                )
                // stop bot setup
            }
        })
        .catch((error) => {
            console.log('error getChatMember :>> ')
            // console.log('error :>> ', error)
        })

    // bot.sendMessage(chatId, textMessageHtml, optionHTML)
})

bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, textMessageHtml, optionHTML)
})

// giveMeAnswer ==============================================
bot.on('message', async (msg) => {
    console.log('message ---->>> ', msg.text)
    if (arrayBlockListSendingGPT.includes(msg.text) !== true) {
        const chatId = msg.chat.id
        const msgLangCode = msg.from.language_code
        let prompt = msg.text
        let answer = ''
        previousMessagesUserId = previousMessages[chatId] || []

        bot.sendChatAction(chatId, 'typing')

        const tempMessage =
            msgLangCode === 'ru'
                ? 'Пожалуйста, подождите немного, пока чат бот ответит на ваш запрос...'
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

        var optionClearKeyboard = {
            reply_markup: JSON.stringify(clean_context),
            // parse_mode: 'HTML',
            // disable_web_page_preview: true,
        }

        if (answer.length > 4096) {
            const chunkSize = 4000
            const chunks = []

            for (let i = 0; i < answer.length; i += chunkSize) {
                chunks.push(answer.slice(i, i + chunkSize))
            }

            console.log(chunks)

            chunks.forEach((chunk) => {
                bot.sendMessage(chatId, chunk, optionClearKeyboard)
            })
        } else {
            bot.sendMessage(chatId, answer, optionClearKeyboard)
        }

        bot.deleteMessage(chatId, tempMsgId)

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
            '________' + '\n' + JSON.stringify(loggingObj, null, '\n  '),
        )
        //====================
        previousMessages[chatId] = previousMessages[chatId] || []
        previousMessages[chatId].push(prompt)
    }
})

// callback_query
// //processing selections on the internal bot keyboard

bot.on('callback_query', (query) => {
    console.log('55555_ :>>callback_query ')
    console.log('query ---------------:>> ', query)

    const chatId = query.from.id
    const data = query.data

    if (data === 'clean_context') {
        // cleaning context________
        previousMessages[chatId] = []

        bot.sendMessage(chatId, 'All your context was cleaned')
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

// bot.on('callback_query', (query) => {
//     const data = query.data
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
