import Analytics from "analytics-node";

// Public write key scoped to data source
const SEGMENT_WRITE_KEY = "5zLPIzVLZYVK40bEzDo8WbYp1omsbEWx";
interface GitHubActionEventProperties {
  branch_name: string; // branch deployed
  app_key: string;
}

export function track(
  properties: GitHubActionEventProperties,
  CONTENTFUL_ACTION_DISABLE_ANALYTICS: string
) {
  if (CONTENTFUL_ACTION_DISABLE_ANALYTICS === "false") {
    return;
  }

  const client = new Analytics(SEGMENT_WRITE_KEY);

  try {
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
