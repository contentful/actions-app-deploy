# Contentful App Deploy

This GitHub Action deploys your frontend apps to Contentful App Hosting.

## What is Contentful

[Contentful](https://www.contentful.com/) provides content infrastructure for digital teams to power content in websites, apps, and devices. Unlike a CMS, Contentful was built to integrate with the modern software stack. It offers a central hub for structured content, powerful management and delivery APIs, and a customisable web app that enables developers and content creators to ship digital products faster.

Contentful is a hosted service, with a free plan for small projects. It is available in 14 languages and has over 100,000 users worldwide.

## What are Contentful Apps

Apps are packages that simplify customization and integration by modifying your Contentful space. An app can help adapt Contentful to individual business processes and integrate with other services.

Check out [Contentful App Framework](https://www.contentful.com/developers/docs/extensibility/app-framework/) to learn more about Contentful Apps.

## Why use this GitHub Action

If your App is hosted on Contentful App Hosting, you can use this GitHub Action to automatically deploy your App after pushing your code. This saves a lot of time and manual uploading.

## Usage

### The workflow file

To use this GitHub Action, you need to create a GitHub workflow file in your repository. The workflow file should be placed in the `.github/workflows` directory in your repository.

The contents of the workflow file should be as follows:

```yaml
on: [push]

jobs:
  deploy_job:
    runs-on: ubuntu-latest
    name: Deploy app to Contentful
    if: contains(github.ref, 'main') || contains(github.ref, 'master')
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 16.x
        uses: actions/setup-node@v3
        with:
          node-version: 16.x
      - run: npm ci
      - run: npm run build
      - uses: contentful/actions-app-deploy@v1
        with:
          organization-id: ${{ secrets.ORGANIZATION_ID }}
          app-definition-id: ${{ secrets.APP_DEFINITION_ID }}
          access-token: ${{ secrets.ACCESS_TOKEN }}
          folder: build
```

### Parameters

- `organization-id` (_required_): The id of the organization.
- `app-definition-id` (_required_): The id of the app definition.
- `access-token` (_required_): A personal access token for the Content Management API. Should be stored as a secret in your GitHub repository (`Settings` -> `Secrets` -> `Actions`).
- `folder` (_required_): The folder which is deployed to Contentful App Hosting. Usually, this is the `build` folder.
- `comment` : A comment which will be associated with the created `AppBundle`. Can be used to differentiate bundles.
- `allow-tracking` (_optional_): Flag that allows us to track the usage of the GitHub Action. Accepted values can be either `true` or `false`, default value will be `true`.

## Running

After you have created the workflow file and added the secrets, you can push your code to the repository. The GitHub Action will automatically run and deploy your App to Contentful App Hosting.
You can see the progress of the workflow in the `Actions` tab of your repository.

## FAQ

**Where to find the organization ID**

Log into Contentful.
Click the Organization name in the top left corner, then "Organization settings".
Click the "Subscription" tab. The ID is listed beneath the organization name.

**Where to find the app definition ID**

Log into Contentful.
From your space, go to the `Apps` tab and click `Custom apps`.
Click `Manage app definitions` and you will see an overview of your custom apps, with the ID printed in the ID column.

**Where to find or create a personal access token**

You can read more about access tokens [here](https://www.contentful.com/help/personal-access-tokens/)

## Development

### Release Process

Releases are automated using [release-please](https://github.com/googleapis/release-please). The release process is triggered by merging changes into the `main` branch.

1. Ensure your commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
2. Merge your changes into the `main` branch.
3. The GitHub Actions workflow will automatically handle versioning, changelog generation, and creating GitHub releases.

## License

[MIT](LICENSE)
