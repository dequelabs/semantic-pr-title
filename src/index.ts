import * as core from '@actions/core'
import * as github from '@actions/github'
import validateTitle from './validate-title'

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

    const { valid, type } = validateTitle(title)

    core.info(`PR type: "${type}"`)

    if (!valid) {
      core.setFailed(
        'PR title does not follow conventional commits.\n\nPlease refer to https://www.conventionalcommits.org/en/v1.0.0'
      )
    }

    console.log('Title matches conventional commits')
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

main()
