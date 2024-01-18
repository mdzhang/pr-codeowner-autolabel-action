# PR Codeowner Autolabel Action

⚠️: Work in progress!

Add labels to GitHub PRs based on the contents of `.github/CODEOWNERS`

## Usage

```yaml
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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute.
