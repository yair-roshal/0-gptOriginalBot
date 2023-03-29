const openaiApiKey = process.env.OPENAI_API_KEY
const axios = require('axios')
const { config_1, config_2 } = require('./../constants/config')

module.exports = giveMeAnswer = async (textRequest, previousMessages) => {
    console.log('previousMessages = CONTEXT :>> ', previousMessages)
    let textContest = `${previousMessages.join('\n')} \n\n ${textRequest}`

    previousMessages.push(textRequest)

    console.log('textContest :>> ', textContest)

    return axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
        },
        data: {
            model: 'gpt-3.5-turbo',
            // model: 'davinci',
            messages: [{ role: 'user', content: textContest }],
            temperature: 0.7,
        },
        // data: config_2,
        // data: config_1,
    })
        .then((response) => {
            return response.data.choices[0].message.content
        })
        .catch((error) => {
            console.log('error', error)

            return ''
        })
}
