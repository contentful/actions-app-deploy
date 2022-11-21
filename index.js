import core from "@actions/core";
import github from "@actions/github";
import { upload } from "@contentful/app-scripts";

const deploy = async function () {
  try {
    const organizationId = core.getInput("organization-id");
    console.log(`OrganizationId ${organizationId}!`);

    const appDefinitionId = core.getInput("app-definition-id");
    console.log(`appDefinitionId ${appDefinitionId}!`);

    const accessToken = core.getInput("access-token");

    const folder = core.getInput("folder");
    console.log(`folder ${folder}!`);

    await upload.nonInteractive({
      "bundle-dir": folder,
      "organization-id": organizationId,
      "definition-id": appDefinitionId,
      token: accessToken,
    });

    const time = new Date().toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

deploy();
