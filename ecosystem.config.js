module.exports = {
    apps: [
        {
            name: 'newBot',
            script: './bot.js',
            instances: 1,
            max_memory_restart: '300M',
            // Logging
            out_file: './newBot-out.log',
            error_file: './newBot-error.log',
            merge_logs: true,
            log_date_format: 'DD-MM HH:mm:ss Z',
            log_type: 'json',
            // Env Specific Config
            env_production: {
                NODE_ENV: 'prod',
                PORT: 8080,
                exec_mode: 'cluster_mode',
                watch: true,
            },
            env_development: {
                NODE_ENV: 'dev',
                PORT: 8080,
                watch: true,
                watch_delay: 3000,
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
            },
        },
    ],
}
