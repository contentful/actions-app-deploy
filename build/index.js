"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_scripts_1 = require("@contentful/app-scripts");
const core_1 = __importDefault(require("@actions/core"));
const deploy = async function () {
    try {
        const organizationId = core_1.default.getInput("organization-id");
        const appDefinitionId = core_1.default.getInput("app-definition-id");
        const accessToken = core_1.default.getInput("access-token");
        const folder = core_1.default.getInput("folder");
        await app_scripts_1.upload.nonInteractive({
            bundleDir: folder,
            organizationId,
            definitionId: appDefinitionId,
            token: accessToken,
        });
        const time = new Date().toTimeString();
        core_1.default.setOutput("time", time);
    }
    catch (error) {
        core_1.default.setFailed(error.message);
    }
};
deploy();
//# sourceMappingURL=index.js.map