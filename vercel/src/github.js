const {Octokit} = require('@octokit/rest')
const octokit = new Octokit({auth: process.env.GITHUB_ACCESS_TOKEN})

module.exports = {
  getTags: async (owner, repo) => {
    let result = []

    let page = 1
    let data
    do {
      data = (await octokit.repos.listTags({
        owner,
        repo,
        per_page: 100,
        page: page++,
      })).data

      result = result.concat(data)
    } while (data.length)

    return result
  },

  addTagToBranch: async (owner, repo, branch, tag, force = false) => {
    if (force) {
      await this.deleteTag(owner, repo, tag)
    }

    const commitSha = (await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    })).data.object.sha

    // todo: octokit.repos.getBranch() has a bug
    // commitSha = (await octokit.repos.getBranch(
    //   owner,
    //   repo,
    //   branch,
    // )).commit.sha

    const tagObjectSha = (await octokit.git.createTag({
      owner,
      repo,
      tag,
      message: tag,
      object: commitSha,
      type: 'commit',
    })).data.sha

    return await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tag}`,
      sha: tagObjectSha,
    })
  },

  deleteTag: async (owner, repo, tag) => {
    try {
      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `refs/tags/${tag}`,
      })
    } catch (e) {
    }
  },
}
