# PR Codeowner Autolabel Action

Add labels to GitHub PRs based on the contents of `.github/CODEOWNERS`

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
        # default is ./CODEOWNERS
        file-path: ./.github/CODEOWNERS
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
