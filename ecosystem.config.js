module.exports = {
    apps: [
        {
            name: 'newBot',
            script: './bot.js',
            max_memory_restart: '300M',
            // Logging
            out_file: './newBot-out.log',
            error_file: './newBot-error.log',
            merge_logs: true,
            log_date_format: 'DD-MM-YYYY HH:mm:ss',
            log_type: 'json',

            watch: true,

            ignore_watch: [
                './node_modules',
                './app/views',
                './public',
                './.DS_Store',
                './package.json',
                './yarn.lock',
                './samples',
                './src',
            ],
            exec_mode: 'cluster',
            instances: 'max',

            // Env Specific Config
            env_production: {
                NODE_ENV: 'prod',
            },
            env_development: {
                NODE_ENV: 'dev',
            },
        },
    ],
}
