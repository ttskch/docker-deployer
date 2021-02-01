const {Octokit} = require('@octokit/rest')
const octokit = new Octokit()

module.exports.getTagsFromBranch = async (owner, repo, branch) => {
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
  } while (!data.length)

  return result
}

module.exports.addTagToBranch = async (owner, repo, branch, tag) => {
  object = (await octokit.repos.getBranch(
    owner,
    repo,
    branch,
  )).commit.sha

  return await octokit.git.createTag({
    owner,
    repo,
    tag,
    message: tag,
    object,
    type: 'commit',
  })
}
