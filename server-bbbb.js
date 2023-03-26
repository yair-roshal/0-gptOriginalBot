const TelegramBot = require('node-telegram-bot-api')
const openai = require('openai')

const dotenv = require('dotenv')
dotenv.config()

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })
openai.apiKey = process.env.OPENAI_API_KEY

console.log('openai.apiKey :>> ', openai.apiKey)
console.log('process.env.BOT_TOKEN :>> ', process.env.BOT_TOKEN)

bot.onText(/\/start/, (msg) => {
    console.log('111111 :>> ')
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'Привет, я бот ChatGPT!')
})

bot.on('message', async (msg) => {
    console.log('22222 :>> ')

    const chatId = msg.chat.id
    const message = msg.text
    const prompt = `Q: ${message}\nA:`

    try {
        const response = await openai.completions.create({
            engine: 'text-davinci-002',
            prompt: prompt,
            maxTokens: 150,
            n: 1,
            stop: ['\n'],
        })

        const answer = response.choices[0].text.trim()
        bot.sendMessage(chatId, answer)
    } catch (err) {
        console.error(err)
        bot.sendMessage(chatId, 'Произошла ошибка при обработке сообщения')
    }
})

bot.on('polling_error', (error) => {
    console.log('33333 :>> ')

    console.error(error)
})
