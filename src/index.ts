import core from '@actions/core'
import github from '@actions/github'
import conventionalCommitsParser from 'conventional-commits-parser'

const validTypes: string[] = [
  'feat',
  'fix',
  'perf',
  'style',
  'docs',
  'refactor',
  'test',
  'build',
  'ci',
  'chore',
  'merge',
  'revert',
  'release'
]

function main() {
  try {
    const title: string =
      github.context.payload &&
      github.context.payload.pull_request &&
      github.context.payload.pull_request.title

    // not sure how this would happen but better safe than sorry
    if (!title) {
      core.setFailed('PR does not have a title')
      return
    }

    core.info(`Validating PR title: "${title}"`)

    const { type } = conventionalCommitsParser.sync(title, {
      // parse merge commits
      mergePattern: /^Merge pull request #(\d+) from (.*)$/,
      mergeCorrespondence: ['id', 'source'],

      // allow comma in scope
      headerPattern: /^(\w*)(?:\(([\w$.\-*, ]*)\))?: (.*)$/
    })

    core.info(`PR type: "${type}"`)

    if (!type || !validTypes.includes(type.toLowerCase())) {
      core.setFailed(
        'PR title does not follow conventional commits.\n\nPlease refer to https://www.conventionalcommits.org/en/v1.0.0'
      )
      return
    }

    console.log('Title matches conventional commits')
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

main()
