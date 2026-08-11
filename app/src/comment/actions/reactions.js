const { newOctokit } = require("../../middleware/auth");

async function react_comment(owner, repo, comment_id, react = "eyes", installationId) {
    try {
        await newOctokit(installationId).rest.reactions.createForIssueComment({
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