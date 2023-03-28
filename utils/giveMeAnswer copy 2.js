const openaiApiKey = process.env.OPENAI_API_KEY

const openai = require('openai')
openai.apiKey = openaiApiKey
const model = 'text-davinci-002'
const prompt = 'Once upon a time'

// Define the options for the API call
const options = {
    prompt: prompt,
    maxTokens: 50,
    n: 1,
    stop: '\n',
    temperature: 0.5,
}

module.exports = giveMeAnswer = async (prompt, previousMessages) => {
    // Call the API and save the context
    openai.completeWithStoredContext(model, options, (err, response) => {
        if (err) throw err

        const { choices, context } = response

        console.log(choices[0].text)
        console.log('Context:', context)
    })
}
