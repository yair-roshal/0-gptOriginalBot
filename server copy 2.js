require('dotenv').config()

console.log('--------------- :>> ')

const OpenAI = require('openai-api')
const openaiApiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI(openaiApiKey)

// const openaiApiKey = process.env.OPENAI_API_KEY
// const openai = new OpenAI(openaiApiKey)

let previousMessages = [
    'Hi, I need help with my computer.',
    'Sure, what seems to be the problem?',
]

let prompt = 'hello , how i can to do it?'

console.log('prompt :>> ', prompt)
console.log('previousMessages :>> ', previousMessages)

let completions
try {
    completions = await openai.complete({
        engine: 'davinci',
        // prompt: `${prompt}`,
        prompt: `${previousMessages.join('\n')} \n\n ${prompt}`,
        maxTokens: 1024,
        n: 1,
        stop: ['\n'],
        temperature: 0.5,
    })
} catch (err) {
    console.log('err :>> ', err)
}

console.log('prompt====', prompt)

console.log('completions.choices :>> ', completions.choices)

// const message = completions.choices[0].text.trim()
// console.log('message====', message)

// return { message, previousMessages }
