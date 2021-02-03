const {Octokit} = require('@octokit/rest')
const octokit = new Octokit({auth: process.env.GITHUB_ACCESS_TOKEN})

module.exports.getTags = async (owner, repo) => {
  let result = []

  let page = 1
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
}

module.exports.addTagToBranch = async (owner, repo, branch, tag) => {

  commitSha = (await octokit.git.getRef({
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

  tagObjectSha = (await octokit.git.createTag({
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
}
