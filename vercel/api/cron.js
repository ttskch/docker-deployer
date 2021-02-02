require('dotenv').config()
const axios = require('axios')
const semver = require('semver')
const github = require('../src/github')

// map of virtual php versions required from deployer and php docker image versions
const phpVersions = {
  '5.99.0': '5',
  '7.0.99': '7.0',
  '7.99.0': '7',
  '8.99.0': '8',
}

const processor = async () => {
  // list target tag names
  let targetTags = []
  const res = await axios.get('https://repo.packagist.org/p/deployer/deployer.json')
  Object.values(res.data.packages['deployer/deployer']).forEach(data => {
    const deployerVersion = data.version.replace(/^v/, '')
    if (!deployerVersion.match(/dev/)) {
      const phpVersion = semver.maxSatisfying(Object.keys(phpVersions), data.require.php)
      const phpDockerImageVersion = phpVersions[phpVersion]
      targetTags.push(`php-${phpDockerImageVersion}/deployer-${deployerVersion}`)
    }
  })

  // get existent tag names
  const existentTags = await github.getTagsFromBranch(
    process.env.GITHUB_OWNER,
    process.env.GITHUB_REPO,
    process.env.GITHUB_BRANCH,
  )

  // extract tags to be added
  const tagsToBeAdded = targetTags.filter(tag => !existentTags.includes(tag.name))

  // add non-existent tags
  tagsToBeAdded.forEach(async tag => {
    // await github.addTagToBranch(
    //   process.env.GITHUB_OWNER,
    //   process.env.GITHUB_REPO,
    //   process.env.GITHUB_BRANCH,
    //   tag,
    // )
  })

  return true
}

module.exports = async (req, res) => {
  await processor() && res.send('OK')
}
