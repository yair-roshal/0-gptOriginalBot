const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })
const chatIdAdmin = process.env.CHAT_ID_ADMIN
const openaiApiKey = process.env.OPENAI_API_KEY

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
bot.on('message', (msg) => {
    const chatId = msg.chat.id

    console.log('3333 :>> ')
    console.log('chatId :>> ', chatId)
    console.log('msg :>> ', msg)
    let answer = giveMeAnswer(msg.text)

    // bot.sendMessage(chatIdAdmin, answer)
    bot.sendMessage(chatId, answer)

    // if (msg.text == '/start') {
    //     bot.sendMessage(chatIdAdmin, `Server-Bot successfully started  `)
    // } else if (!dictionary.includes(msg.text) && msg.text !== '/start') {
    //     dictionary = dictionary.concat(msg.text.split(/\r?\n/))
    //     bot.sendMessage(
    //         chatIdAdmin,
    //         `Successfully added "${msg.text}" to the dictionary.`,
    //     )
    // }
})

const giveMeAnswer = async (textRequest) => {
    await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
        },
        data: {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: textRequest }],
            temperature: 0.7,
        },
    })
        .then((response) => {
            // console.log('response.data==', response.data)
            // console.log('choices==', response.data.choices[0])
            // console.log('message==', response.data.choices[0].message)
            console.log('content==', response.data.choices[0].message.content)

            return response.data.choices[0].message.content
        })
        .catch((error) => {
            console.log('error', error)

            return ''
        })
}
