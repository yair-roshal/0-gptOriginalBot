//==================================

const startAlwaysMenu_2buttons = {
    reply_markup: {
        keyboard: [
            // inline_keyboard: [
            [
                {
                    // text: 'Clean context',
                    text: '/clean_context',
                    callback_data: 'clean_context',
                },
            ],
            [
                {
                    text: '🎯 If you want to add anything to bot, chat me !!! 🎯',
                    request_contact: true,
                },
            ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
}

const inline_keyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'OK',
                    callback_data: 'ok',
                },
            ],
        ],
    },
}

//==================================

const callToAdminMenu = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Contact the admin',
                    request_contact: true,
                },
            ],
        ],
    },
}

module.exports = {
    startAlwaysMenu_2buttons,
    callToAdminMenu,
    inline_keyboard,
}
