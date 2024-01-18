# PR Codeowner Autolabel Action

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
      filepath: ./.github/CODEOWNERS

```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute.
