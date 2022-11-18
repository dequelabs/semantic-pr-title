import * as conventionalCommitsParser from 'conventional-commits-parser'
import * as conventionalCommitsTypes from 'conventional-commit-types'

const validTypes: string[] = Object.keys(conventionalCommitsTypes.types)

interface ValidTitle {
  valid: boolean
  type: string | null | undefined
}

export default function isValidTitle(title: string): ValidTitle {
  const { type } = conventionalCommitsParser.sync(title, {
    // parse merge commits
    mergePattern: /^Merge pull request #(\d+) from (.*)$/,
    mergeCorrespondence: ['id', 'source'],

    // allow comma in scope
    headerPattern: /^(\w*)(?:\(([\w$.\-*, ]*)\))?: (.*)$/
  })

  // we allow merge, refactor, and release titles as
  // valid pr titles
  if (!type) {
    const firstWord = title.split(' ')[0]

    if (['Merge', 'Revert', 'Release'].includes(firstWord)) {
      return {
        valid: true,
        type: firstWord.toLowerCase()
      }
    }
  }

  if (!type) {
    return {
      valid: false,
      type
    }
  }

  return {
    valid: validTypes.includes(type.toLowerCase()),
    type: type.toLowerCase()
  }
}
