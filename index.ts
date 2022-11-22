import { upload } from "@contentful/app-scripts";
import core from "@actions/core";

const deploy = async function () {
  try {
    const organizationId: string = core.getInput("organization-id");
    console.log(`OrganizationId ${!!organizationId}!`);

    const appDefinitionId: string = core.getInput("app-definition-id");
    console.log(`appDefinitionId ${!!appDefinitionId}!`);

    const accessToken: string = core.getInput("access-token");
    console.log(`accessToken ${!!accessToken}!`);

    const folder: string = core.getInput("folder");
    console.log(`folder ${!!folder}!`);

    await upload.nonInteractive({
      bundleDir: folder,
      organizationId,
      definitionId: appDefinitionId,
      token: accessToken,
    });

    const time = new Date().toTimeString();
    core.setOutput("time", time);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

deploy();
