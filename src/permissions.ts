import Config from "./config";
import Utils from "./utils";
import { localizeHtmlPage } from "./maze-utils/setup";
const utils = new Utils();

// This is needed, if Config is not imported before Utils, things break.
// Probably due to cyclic dependencies
Config.config;

if (document.readyState === "complete") {
    init();
} else {
    document.addEventListener("DOMContentLoaded", init);
}

async function init() {
    localizeHtmlPage();

    const acceptButton = document.getElementById("acceptPermissionButton");
    acceptButton.addEventListener("click", () => {
        utils.applyInvidiousPermissions(Config.config.supportInvidious).then((enabled) => {
            Config.config.supportInvidious = enabled;

            if (enabled) {
                alert(chrome.i18n.getMessage("permissionRequestSuccess"));
                window.close();
            } else {
                alert(chrome.i18n.getMessage("permissionRequestFailed"));
            }
        })
    });
}