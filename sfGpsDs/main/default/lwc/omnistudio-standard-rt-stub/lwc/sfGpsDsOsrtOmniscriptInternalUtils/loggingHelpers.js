import { logUsageInteractionEvent } from "c/sfGpsDsOsrtOmniscriptRestApi";

/**
 * @description Performs logging for OmniStudio Usage Monitoring
 * @param {String} omniscriptName
 * @param {String} omniscriptId
 */
export function logOmniscriptUsageEvent(omniscriptName, omniscriptId) {
  logUsageInteractionEvent({
    componentType: "OmniScript",
    componentName: omniscriptName,
    componentId: omniscriptId
  });
}
