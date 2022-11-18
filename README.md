# Contentful Deploy 

This action prints deploys frontend apps to contentful.
## Inputs

### `organization-id`

**Required** The id of the organization.
### `app-definition-id`

**Required** app-definition-id.
### `access-token`

**Required** access token required to deploy the app.
### `folder`

**Required** deploys a specific output folder to Contentful’s app hosting.

## Outputs

### `result`

Successfully Deployed or not.

## Example usage

```yaml
uses: contentful/app-deploy@v1
with:
  organization-id: 'xxx'
  app-definition-id: 'xxx'
  access-token: 'xxx'
  folder: 'build'
```