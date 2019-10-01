module.exports = {
    apps: [
        {
            name: "SOP",
            script: "bin/www",
            watch: true,
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            exec_mode: "cluster",
            instances: 1
        }
    ]
}





