const { Configuration, OpenAIApi } = require('openai')
let myApiKey = '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'

const configuration = new Configuration({
    apiKey: myApiKey,
})

const openai = new OpenAIApi(configuration)

const completion = openai.createCompletion({
    model: 'gpt-3.5-turbo',
    // model: 'ada',
    prompt: process.argv.slice(2).toString(),
    max_tokens: 1000,
})

console.info('sedang mencari jawaban ...')

completion.then((r) => {
    console.info(r.data.choices[0].text)
})
