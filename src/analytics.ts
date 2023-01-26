import Analytics from "analytics-node";

/**
 * Public write key scoped to data source member
 * @type {string}
 */
const SEGMENT_WRITE_KEY = "5zLPIzVLZYVK40bEzDo8WbYp1omsbEWx";
interface GitHubActionEventProperties {
  branch_name: string; // branch deployed
  app_key: string;
}

export function track(
  properties: GitHubActionEventProperties,
  contentful_action_disable_analytics: string
) {
  if (contentful_action_disable_analytics === "false") {
    return;
  }

  try {
    const client = new Analytics(SEGMENT_WRITE_KEY, {
      errorHandler: () => {
        // noop
      },
    });
    client.track({
      event: "branch_deployed",
      properties,
      anonymousId: Date.now(),
      timestamp: new Date(),
    });
  } catch (e) {
    // ignore any error, doesn't provide any value
  }
}
