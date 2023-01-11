import Analytics from 'analytics-node';

// Public write key scoped to data source
const SEGMENT_WRITE_KEY = '5zLPIzVLZYVK40bEzDo8WbYp1omsbEWx'
interface GitHubActionEventProperties {
  branch: string; // branch to be deployed using the action
}

export function track(properties: GitHubActionEventProperties) {
  if (process.env['DISABLE_ANALYTICS']) {
    return;
  }

  const client = new Analytics(SEGMENT_WRITE_KEY);

  try {
    client.track({
      event: 'actions-app-deploy',
      properties,
      anonymousId: Date.now(),
      timestamp: new Date(),
    });

  } catch (e) {
    console.error(e);
  }
}