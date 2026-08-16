const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
const dotenv = require("@dotenvx/dotenvx");

dotenv.config({ path: "src/.env" })

function newOctokit(installationId) {
    const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.APP_ID,
            privateKey: process.env.PRIVATE_KEY,
            installationId: installationId,
        },
    });

    return octokit
}

module.exports = { newOctokit };