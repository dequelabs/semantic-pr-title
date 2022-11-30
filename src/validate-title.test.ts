import { assert } from 'chai'
import validateTitle from './validate-title'
import * as conventionalCommitsTypes from 'conventional-commit-types'

describe('is-valid-title', () => {
  Object.keys(conventionalCommitsTypes.types).forEach(key => {
    it(`returns true for ${key} type`, () => {
      const { valid, type } = validateTitle(`${key}: pr title`)
      assert.isTrue(valid)
      assert.equal(type, key)
    })
  })

  it('returns true for revert commit', () => {
    const { valid, type } = validateTitle(
      'Revert "fix(app): Add a Content Security Policy"'
    )
    assert.isTrue(valid)
    assert.equal(type, 'revert')
  })

  it('returns true for merge commit', () => {
    const { valid, type } = validateTitle(
      'Merge pull request #1 from user/feature/feature-name'
    )
    assert.isTrue(valid)
    assert.equal(type, 'merge')
  })

  it('returns true for release commit', () => {
    const { valid, type } = validateTitle('Release v4.2.1')
    assert.isTrue(valid)
    assert.equal(type, 'release')
  })

  it('returns true for title with scope', () => {
    const { valid, type } = validateTitle('fix(scope,other): fix both')
    assert.isTrue(valid)
    assert.equal(type, 'fix')
  })

  it('returns true for uppercase type', () => {
    const { valid, type } = validateTitle('FIX: fix uppercase')
    assert.isTrue(valid)
    assert.equal(type, 'fix')
  })

  it('returns false for title without a colon', () => {
    const { valid, type } = validateTitle('fix a bug')
    assert.isFalse(valid)
    assert.equal(type, null)
  })

  it('returns false for title without a whitespace after the colon', () => {
    const { valid, type } = validateTitle('fix:a bug')
    assert.isFalse(valid)
    assert.equal(type, null)
  })

  it('returns false for invalid type', () => {
    const { valid, type } = validateTitle('fixture: a bug fix')
    assert.isFalse(valid)
    assert.equal(type, 'fixture')
  })

  it('returns false for merge-like title', () => {
    const { valid, type } = validateTitle('merge mater into develop')
    assert.isFalse(valid)
    assert.equal(type, null)
  })

  it('returns false for release-like title', () => {
    const { valid, type } = validateTitle('release the kraken')
    assert.isFalse(valid)
    assert.equal(type, null)
  })

  it('returns false for revert-like title', () => {
    const { valid, type } = validateTitle('revert previous commit')
    assert.isFalse(valid)
    assert.equal(type, null)
  })

  it('allows comma in scope', () => {
    const { valid, type } = validateTitle('fix(thing1,thing2): a bug')
    assert.isTrue(valid)
    assert.equal(type, 'fix')
  })

  it('allows slash in scope', () => {
    const { valid, type } = validateTitle('fix(path/thing1,path/thing2): a bug')
    assert.isTrue(valid)
    assert.equal(type, 'fix')
  })
})
