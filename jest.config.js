module.exports = {
    projects: [
        {
            displayName: "client",
            testMatch: ["<rootDir>/tests/client/**/*.ts"]
        },
        {
            displayName: "server",
            testEnvironment: "node",
            testMatch: ["<rootDir>/tests/server/**/*.ts"]
        }
    ]
};
