const { newOctokit } = require("../../middleware/auth");

async function is_exist(owner, repo, label_name, installationId) {
    try {
        const { data } = await newOctokit(installationId).rest.issues.getLabel({
            owner: owner,
            repo: repo,
            name: label_name
        });
        return data;
    } catch (err) {}
}

async function make(owner, repo, label, installationId) {
    const color = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    
    await newOctokit(installationId).rest.issues.createLabel({
        owner: owner,
        repo: repo,
        name: label?.name,
        color: label?.color ?? color
    })
}

async function add(owner, repo, pull_number, labels, installationId) {
    for (const label of labels) {
        if (await is_exist(owner, repo, label.name, installationId) == undefined) {
            await make(owner, repo, label, installationId)
        }
    }
    
    await newOctokit(installationId).rest.issues.addLabels({
        owner: owner,
        repo: repo,
        issue_number: pull_number,
        labels: labels.map(label => label.name)
    })
}

async function del(owner, repo, pull_number, labels, installationId) {
    for (const label of labels) {
        try {
            await newOctokit(installationId).rest.issues.removeLabel({
                owner: owner,
                repo: repo,
                issue_number: pull_number,
                name: label
            })
        } catch {}
    }
}

module.exports = {
    add,
    del
}