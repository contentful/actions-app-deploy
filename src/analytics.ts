import Analytics from 'analytics-node';

interface Properties {
  branch: string;
}

class AnalyticsClient {
  private client: Analytics

  constructor() {
    this.client = new Analytics(process.env['write_key'] || '');
  }

  track(properties: Properties) {
    
    const segmentEvent: Parameters<Analytics['track']>[0] = {
      event: '',
      properties,
    };

    try {
      this.client.track(segmentEvent);
    } catch (e) {
      console.error(e);
    }
  }
}

const client = new AnalyticsClient();

export default client;