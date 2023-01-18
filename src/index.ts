import { upload } from "@contentful/app-scripts";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { track } from "./analytics";

async function deploy(): Promise<void> {
  try {
    const organizationId: string = core.getInput("organization-id");
    const appDefinitionId: string = core.getInput("app-definition-id");
    const accessToken: string = core.getInput("access-token");
    const folder: string = core.getInput("folder");

    const branchDeployed = github.context.ref;

    track({ branch_name: branchDeployed, app_key: appDefinitionId });

    await upload.nonInteractive({
      bundleDir: folder,
      organizationId,
      definitionId: appDefinitionId,
      token: accessToken,
      userAgentApplication: "contentful.actions-app-deploy",
    });
  } catch (error) {
    core.setFailed(`${(error as any)?.message ?? error}`);
  }
}

deploy();
