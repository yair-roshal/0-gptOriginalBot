const bot = require('./bot');


//processing selections on the internal bot keyboard
bot.on('callback_query', (query) => {
    console.log('query11111 :>> ', query)
    console.log('55555_ :>>callback_query ')

    if (query.data === 'clean_context') {
        console.log('query.data = clean_context :>> ')

        bot.sendMessage(
            chatIdAdmin,
            'All was cleaned',
            startAlwaysMenu_2buttons,
            // inline_keyboard,
        )
    }
})