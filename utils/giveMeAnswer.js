const openaiApiKey = process.env.OPENAI_API_KEY
const axios = require('axios')

module.exports = giveMeAnswer = async (textRequest) => {
    return axios({
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
            console.log(
                'content_giveMeAnswer : ',
                response.data.choices[0].message.content,
            )

            return response.data.choices[0].message.content
        })
        .catch((error) => {
            console.log('error', error)

            return ''
        })
}
