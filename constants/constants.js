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
const startAlwaysMenu_2buttons = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Clean context',
                    callback_data: 'clean_context',
                },
            ],
            [
                {
                    text: 'What you want to add???',
                    request_contact: true,
                },
            ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
}

const testMenu = {
    // reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: 'Level 1' }]],
    }),
}
 

module.exports = {
   
    testMenu,
    startAlwaysMenu_2buttons,
    callToAdminMenu,
}
