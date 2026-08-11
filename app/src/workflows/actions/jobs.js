const { newOctokit } = require("../../middleware/auth");
const label = require("../../pulls/actions/label");

async function getMergeableState(owner, repo, pull_number, installationId) {
    const { data: pr } = await newOctokit(installationId).pulls.get({ owner, repo, pull_number });
    
    if (pr.mergeable !== null) return pr;
}

async function safeToMerge(owner, repo, pull_number, job, head, base, installationId) {
    const jobSucceeded = job.conclusion === "success";
    const pr = await getMergeableState(owner, repo, pull_number, installationId);
    if (!pr) return;

    if (jobSucceeded && pr.mergeable === true && ["clean", "blocked"].includes(pr.mergeable_state) != undefined) {
        await label.del(owner, repo, pull_number, ["unsafe to merge"], installationId);
        await label.add(owner, repo, pull_number, [{ name: "needs: reviewer", color: "312238" }], installationId);
        await label.add(owner, repo, pull_number, [{ name: "safe to merge", color: "05dbb4" }], installationId);
        await label.add(owner, repo, pull_number, [{ name: "merge-bot: eligible", color: "768fbe" }], installationId);
    } else {
        await label.del(owner, repo, pull_number, ["safe to merge", "needs: reviewer", "merge-bot: eligible"], installationId);
        await label.add(owner, repo, pull_number, [{ name: "unsafe to merge", color: "e03849" }], installationId);
    }
}

module.exports = { safeToMerge }