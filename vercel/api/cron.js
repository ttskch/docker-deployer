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
  const res = (await axios.get('https://repo.packagist.org/p/deployer/deployer.json')).data
  const list = Object.values(res.packages['deployer/deployer']).filter(data => !data.version.match(/dev/))
  list.forEach(data => {
    const deployerVersion = data.version.replace(/^v/, '')
    const phpGte = data.require.php.match(/^>=(\d+)/)
    const phpDockerImageVersion = phpGte ? phpGte[1] : phpVersions[semver.maxSatisfying(Object.keys(phpVersions), data.require.php)]
    targetTags.push(`php-${phpDockerImageVersion}/deployer-${deployerVersion}`)
  })
  // add wild tags like php-7/deployer-6 or php-7/deployer-6.8
  const stables = targetTags.map(tag => tag.match(/^php-.+\/deployer-(\d+\.\d+\.\d+)$/)).filter(v => !!v).map(match => match[1])
  const majors = Array.from(new Set(stables.map(v => v.replace(/\.\d+\.\d+$/, '')))).map(range => semver.maxSatisfying(stables, range))
  const minors = Array.from(new Set(stables.map(v => v.replace(/\.\d+$/, '')))).map(range => semver.maxSatisfying(stables, range))
  majors.forEach(version => {
    tag = targetTags.filter(v => v.match(new RegExp(`.+/deployer-${version.replace('.', '\.')}`)))[0]
    targetTags.push(tag.replace(/^php-(.+)\/deployer-(.+)$/, `php-$1/deployer-${version.replace(/\.\d+\.\d+$/, '')}`))
  })
  minors.forEach(version => {
    tag = targetTags.filter(v => v.match(new RegExp(`.+/deployer-${version.replace('.', '\.')}`)))[0]
    targetTags.push(tag.replace(/^php-(.+)\/deployer-(.+)$/, `php-$1/deployer-${version.replace(/\.\d+$/, '')}`))
  })

  // get existent tag names
  const existentTags = (await github.getTags(
    process.env.GITHUB_OWNER,
    process.env.GITHUB_REPO,
  )).map(tag => tag.name)

  // extract tags to be added
  const tagsToBeAdded = targetTags.filter(tag => !existentTags.includes(tag.name))

  // add non-existent tags
  tagsToBeAdded.forEach(async tag => {
    await github.addTagToBranch(
      process.env.GITHUB_OWNER,
      process.env.GITHUB_REPO,
      process.env.GITHUB_BRANCH,
      tag,
    )
  })

  return true
}

module.exports = async (req, res) => {
  await processor() && res.send('OK')
}
