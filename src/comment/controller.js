const reactions = require('./actions/reactions')
const merge = require('../pulls/actions/merge')

async function handle_comment_pr(comment, data) {
    const owner = data.repository.owner.login
    const repo = data.repository.name
    const comment_id = comment.id
    const pr_url = String(data.issue?.pull_request?.url)


    if (data.issue.state == "open") {
        if (comment.body == "/merge") {
            await reactions.react_comment(owner, repo, comment_id, data.installation.id)
            await merge.merge_pull_request(owner, repo, parseInt(pr_url.split("/").at(-1), 10), comment_id, data.installation.id)
        }
    }
}

async function controller(data) {
    const comment = data.comment;
    
    if (data.issue != undefined && data.issue.pull_request != undefined) {
        await handle_comment_pr(comment, data)
    }
}

module.exports = { controller }