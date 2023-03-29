const openaiApiKey = process.env.OPENAI_API_KEY
const OpenAI = require('openai-api')
const openai = new OpenAI(openaiApiKey)



module.exports = giveMeAnswer = async (prompt, previousMessages) => {
    console.log('prompt :>> ', prompt)
    console.log('previousMessages :>> ', previousMessages)
    const completions = await openai.complete({
        engine: 'davinci',
        prompt: `${prompt}`,
        // prompt: `${previousMessages.join('\n')} \n\n ${prompt}`,
        maxTokens: 1024,
        n: 1,
        stop: ['\n'],
        temperature: 0.5,
    })

    const message = completions.choices[0].text.trim()
    console.log('message====', message)
    return { message, previousMessages }
}


