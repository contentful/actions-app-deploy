import { upload } from "@contentful/app-scripts";
import core from "@actions/core";
const deploy = async function () {
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
        });
        const time = new Date().toTimeString();
        core.setOutput("time", time);
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
deploy();
//# sourceMappingURL=index.js.map