import { upload } from "@contentful/app-scripts";
import core from "@actions/core";
async function deploy() {
    try {
        const organizationId = core.getInput("organization-id");
        const appDefinitionId = core.getInput("app-definition-id");
        const accessToken = core.getInput("access-token");
        const folder = core.getInput("folder");
        await upload.nonInteractive({
            bundleDir: folder,
            organizationId,
            definitionId: appDefinitionId,
            token: accessToken,
            userAgentApplication: 'contentful.actions-app-deploy'
        });
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
;
deploy();
