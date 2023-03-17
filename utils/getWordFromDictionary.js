 const TelegramBot = require('node-telegram-bot-api')
  
const getWordFromDictionary = (dictionary) => {
    const openai = require('openai')
    const TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'
    const bot = new TelegramBot(TOKEN, { polling: true })
    openai.apiKey = OPENAI_API_KEY

    bot.on('message', async (msg) => {
        const chatId = process.env.CHAT_ID_ADMIN
        // const chatId = msg.chat.id
        const text = msg.text

        // Call the OpenAI API to generate a response using GPT-3
        const response = await openai.completions.create({
            engine: 'text-davinci-002',
            prompt: text,
            maxTokens: 150,
            n: 1,
            stop: '\n',
        })

        // Send the response back to the user
        bot.sendMessage(chatId, response.data.choices[0].text)
    })
}

module.exports = getWordFromDictionary
