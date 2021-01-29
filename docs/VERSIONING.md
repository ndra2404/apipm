# Versioning

## Create tag

Git has the ability to tag specific points in a repository's history as being important. We use this functionality to mark release points (v1.0.0, v2.0, and so on).

```bash
git tag -a v1.x.x COMMIT_ID -m "Release message"
git push origin --tags
```

## Create changelog

A changelog is a file which contains a curated, chronologically ordered list of notable changes for each version of a project. We use a library named `standard-changelog` to generate a changelog file.

```bash
npm install -g standard-changelog
standard-changelog
```

## Semantic version

Semantic version is a convention for specifying compatibility using three part version number: MAJOR.MINOR.PATCH.

1. MAJOR version when we make incompatible API changes / new core
2. MINOR version when we make new feature or functionality
3. PATCH version when we make bug fixes.

## Reference

1. <https://git-scm.com/book/en/v2/Git-Basics-Tagging>
1. <https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/standard-changelog#readme>
1. <https://semver.org/>
