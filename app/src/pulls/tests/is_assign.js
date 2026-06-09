const { octokit } = require('../../middleware/auth');

async function prIsAssign(owner, repo, pull_number) {
    try {
        const pull = await octokit.rest.pulls.get({
            owner: owner,
            repo: repo,
            pull_number: pull_number
        });

        if (pull.data.assignees != undefined)
            return true;
        return false;
    } catch (err) {
        return false;
    }
}

module.exports = { prIsAssign };