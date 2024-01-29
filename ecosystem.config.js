module.exports = {
    apps: [
        {
            name: 'croffle',
            script: 'dist/main.js',
            env_dev: {
                ENV: 'dev',
            },
            env_test: {
                ENV: 'test',
            },
            env_prod: {
                ENV: 'prod',
            },
            out_file: '/usr/src/app/logs/croffle-out.log',
            error_file: '/usr/src/app/logs/croffle-error.log',
        },
    ],
};
