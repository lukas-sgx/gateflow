const comment = require("./actions/comment");
const review = require("./actions/review");

async function handle_new_pr(pull_request, data) {
    if (pull_request.base.ref === "main" && pull_request.head.ref != "dev") {
        await review.request_changes(
            data.repository.owner.login,
            data.repository.name,
            pull_request.number,
            `This PR is targeting the wrong branch,
**\`main\`** should only receive merges from **\`dev\`**.
            
Please update the base branch to \`dev\` and resubmit.`
        )
    } else {
        if (pull_request.body === null) {
            await review.request_changes(
                data.repository.owner.login,
                data.repository.name,
                pull_request.number,
                `This PR has no description.
                
Please add a **PR body** explaining:
- What this change does
- Why it's needed
- How it was tested (if applicable)

This helps reviewers understand the context faster.`
            )
        }
        try {
            await comment.add(
                data.repository.owner.login,
                data.repository.name,
                pull_request.number,
                `Once the PR is merged, the deployment will be triggered automatically. Reviewers will be notified once all CI checks have passed, please make sure:

- [ ] All tests pass locally
- [ ] The description clearly explains the changes
- [ ] Related issues are linked (closes #...)
- [ ] No debug code or TODOs left behind

Thanks for your contribution!`
            );
        } catch (err) { }
    }
}

async function controller(data) {
    const pull_request = data.pull_request;
    
    if (data.action === "opened" || data.action === "reopened") {
        await handle_new_pr(pull_request, data)
    }
}

module.exports = { controller }