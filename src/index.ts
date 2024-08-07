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
    const comment: string | undefined = core.getInput("comment");
    const allowTracking: string = core.getInput("allow-tracking");

    const branchDeployed = github.context.ref;

    track(
      { branch_name: branchDeployed, app_key: appDefinitionId },
      allowTracking
    );

    await upload.nonInteractive({
      bundleDir: folder,
      organizationId,
      definitionId: appDefinitionId,
      token: accessToken,
      comment: comment,
      userAgentApplication: "contentful.actions-app-deploy",
    });
  } catch (error) {
    core.setFailed(`${error instanceof Error ? error.message : error}`);
  }
}

deploy();
