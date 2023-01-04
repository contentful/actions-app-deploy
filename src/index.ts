import { upload } from "@contentful/app-scripts";
import * as core from '@actions/core'
import * as github from '@actions/github'

async function deploy(): Promise<void> {
  try {
    const organizationId: string = core.getInput("organization-id");
    const appDefinitionId: string = core.getInput("app-definition-id");
    const accessToken: string = core.getInput("access-token");
    const folder: string = core.getInput("folder");

    const branch = github.context.payload["ref"]

    core.warning(`branch, ${branch}`)

    await upload.nonInteractive({
      bundleDir: folder,
      organizationId,
      definitionId: appDefinitionId,
      token: accessToken,
      userAgentApplication: "contentful.actions-app-deploy",
    });
  } catch (error) {
    core.setFailed(`${(error as any)?.message ?? error}`)
  }
}

deploy();
