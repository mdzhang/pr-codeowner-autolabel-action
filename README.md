# PR Codeowner Autolabel Action

[![GitHub Super-Linter](https://github.com/mdzhang/pr-codeowner-autolabel-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/mdzhang/pr-codeowner-autolabel-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/mdzhang/pr-codeowner-autolabel-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/mdzhang/pr-codeowner-autolabel-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/mdzhang/pr-codeowner-autolabel-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/mdzhang/pr-codeowner-autolabel-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Add labels to GitHub PRs based on the contents of [`CODEOWNERS`](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Usage

```yaml
jobs:
  permissions:
    contents: read
    pull-requests: write
  steps:
    - name: Checkout
      id: checkout
      uses: actions/checkout@v4

    - name: PR Codeowner Autolabel
      id: pr-codeowner-autolabel
      uses: mdzhang/pr-codeowner-autolabel
      with:
        # default is CODEOWNERS
        file-path: .github/CODEOWNERS
        repo-token: ${{ secrets.GITHUB_TOKEN }}
        labels-to-owners: |
          {
            "frontend": "@myteam/@frontend-guild"
          }
```

## Permissions

In order to add labels to pull requests, this action requires write permissions on the pull-request.
Refer to the [GitHub token permissions documentation](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token) for more details about access levels and event contexts.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute.
