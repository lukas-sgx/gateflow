const { newOctokit } = require("../middleware/auth");
const jobs_runner = require("./actions/jobs");

const runningJobs = new Map();

async function controller(data) {
    const job = data.workflow_job;
    const run_id = job.run_id;
    const owner = data.repository.owner.login;
    const repo = data.repository.name;

    if (data.action === "queued") {
        if (!runningJobs.has(run_id)) runningJobs.set(run_id, new Set());
        runningJobs.get(run_id).add(job.id);
        return;
    }

    if (data.action === "completed") {
        const jobs = runningJobs.get(run_id);
        if (!jobs) return;

        jobs.delete(job.id);

        if (jobs.size === 0) {
            runningJobs.delete(run_id);

            let pulls = []; 
            const octokit = newOctokit(data.installation.id);

            try {
                const response = await octokit.repos.listPullRequestsAssociatedWithCommit({
                    owner,
                    repo,
                    commit_sha: job.head_sha,
                });
                pulls = response.data || [];
            } catch (err) {
                console.error(err);
            }

            if (pulls.length === 0 && job.head_branch) {
                try {
                    const response = await octokit.pulls.list({
                        owner,
                        repo,
                        state: "open",
                        per_page: 100
                    });

                    const allOpenPulls = response.data || [];

                    pulls = allOpenPulls.filter(pr => pr.head.ref === job.head_branch);
                } catch (err) {
                    console.error(err);
                }
            }

            if (pulls.length === 0);

            const pr_number = pulls[0].number;
            await jobs_runner.safeToMerge(owner, repo, pr_number, job, data.installation.id);
        }
    }
}

module.exports = { controller };
