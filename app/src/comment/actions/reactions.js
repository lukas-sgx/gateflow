const { octokit } = require("../../middleware/auth");

async function react_comment(owner, repo, comment_id, react = "eyes") {
    try {
        await octokit.rest.reactions.createForIssueComment({
            owner: owner,
            repo: repo,
            comment_id: comment_id,
            content: react,
        });
    } catch (err) {}
}

module.exports = {
    react_comment
}