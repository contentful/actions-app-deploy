import { upload } from "@contentful/app-scripts";
import core from "@actions/core";

async function deploy(): Promise<void> {
  try {
    const organizationId: string = core.getInput("organization-id");
    const appDefinitionId: string = core.getInput("app-definition-id");
    const accessToken: string = core.getInput("access-token");
    const folder: string = core.getInput("folder");

    await upload.nonInteractive({
      bundleDir: folder,
      organizationId,
      definitionId: appDefinitionId,
      token: accessToken,
      userAgentApplication: 'contentful.actions-app-deploy'
    });

  } catch (error: any) {
    core.setFailed(error.message);
  }
};

deploy();
