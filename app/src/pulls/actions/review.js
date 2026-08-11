const { newOctokit } = require("../../middleware/auth");

async function request_changes(owner, repo, pull_number, body, installationId) {
    try {
        await newOctokit(installationId).rest.pulls.createReview({
            owner: owner,
            repo: repo,
            pull_number: pull_number,
            event: 'REQUEST_CHANGES',
            body: body,
        });
    } catch (err) {}
}

module.exports = {
    request_changes
}