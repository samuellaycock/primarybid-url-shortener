module.exports = {
    projects: [
        {
            displayName: "client",
            testMatch: ["<rootDir>/tests/client/**/*.test.ts"],
            moduleFileExtensions: ["js", "ts", "vue"],
            transform: {
                "\\.ts$": "ts-jest",
                "^.+\\.vue$": "vue-jest"
            }
        },
        {
            displayName: "server",
            testEnvironment: "node",
            testMatch: ["<rootDir>/tests/server/**/*.ts"]
        }
    ]
};
