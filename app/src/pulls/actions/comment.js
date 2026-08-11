const { newOctokit } = require('../../middleware/auth');

async function add(owner, repo, pull_number, comment, installationId) {
    const { data } = await newOctokit(installationId).rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: comment
    });

    return data;
}

module.exports = { add };