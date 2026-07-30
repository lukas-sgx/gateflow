const { octokit } = require("../../middleware/auth");
const reactions = require('../../comment/actions/reactions')

async function get_pull_request_ref(owner, repo, pr_number) {
    try {
        const response = await octokit.rest.pulls.get({
          owner: owner,
          repo: repo,
          pull_number: pr_number,
        });

        return {
            baseBranch: response.data.base.ref,
            headBranch: response.data.head.ref,
            body: response.data.body
        }
    } catch (error) {}
    return {
        baseBranch: null,
        headBranch: null,
        body: null
    }
}

async function merge_pull_request(owner, repo, pr_number, comment_id, type = "merge") {
    try {
        var { baseBranch, headBranch, body } = await get_pull_request_ref(owner, repo, pr_number)


        if (baseBranch === null || headBranch === null) {
            return
        }
        const response = await octokit.rest.pulls.merge({
            owner: owner,
            repo: repo,
            pull_number: pr_number,
            commit_title: `merge: ${headBranch} -> ${baseBranch} #${pr_number}`,
            commit_message: `${body}`,
            merge_method: type,
        });

        if (response.data.merged) {
            await reactions.react_comment(owner, repo, comment_id, "rocket")
        } else {
            await reactions.react_comment(owner, repo, comment_id, "❌")
        }
    } catch (error) {}
}

module.exports = {
    merge_pull_request
}