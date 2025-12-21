import crypto from 'crypto';

export class OrbitEcosystemClient {
  private apiKey: string;
  private apiSecret: string;
  private hubUrl: string;

  constructor(apiKey?: string, apiSecret?: string, hubUrl = 'https://orbitstaffing.io') {
    this.apiKey = apiKey || process.env.DARKWAVE_API_KEY || '';
    this.apiSecret = apiSecret || process.env.DARKWAVE_API_SECRET || '';
    this.hubUrl = hubUrl;
  }

  private sign(method: string, path: string, timestamp: string, body = ''): string {
    const payload = `${method}:${path}:${timestamp}:${body}`;
    return crypto.createHmac('sha256', this.apiSecret).update(payload).digest('hex');
  }

  async request<T = unknown>(method: string, path: string, data: unknown = null): Promise<T> {
    const timestamp = Date.now().toString();
    const body = data ? JSON.stringify(data) : '';
    const signature = this.sign(method, path, timestamp, body);

    const response = await fetch(`${this.hubUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-API-Secret': signature,
        'X-Timestamp': timestamp,
      },
      body: data ? body : undefined,
    });
    return response.json() as T;
  }

  async checkStatus() {
    return this.request('GET', '/api/ecosystem/status');
  }

  async getApps() {
    return this.request('GET', '/api/ecosystem/apps');
  }

  async syncWorkers(workers: unknown[]) {
    return this.request('POST', '/api/ecosystem/sync/workers', { workers });
  }

  async syncContractors(contractors: unknown[]) {
    return this.request('POST', '/api/ecosystem/sync/contractors', { contractors });
  }

  async syncTimesheets(timesheets: unknown[]) {
    return this.request('POST', '/api/ecosystem/sync/timesheets', { timesheets });
  }

  async getSnippets(category?: string, language?: string) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (language) params.set('language', language);
    return this.request('GET', `/api/ecosystem/snippets?${params.toString()}`);
  }

  async pushSnippet(snippet: { title: string; code: string; language: string; category: string; description?: string }) {
    return this.request('POST', '/api/ecosystem/snippets', snippet);
  }

  async getLogs() {
    return this.request('GET', '/api/ecosystem/logs');
  }

  async log(event: { type: string; message: string; data?: unknown }) {
    return this.request('POST', '/api/ecosystem/logs', event);
  }

  async registerApp(appData: {
    appName: string;
    appSlug: string;
    appUrl?: string;
    description?: string;
    category?: string;
    permissions?: string[];
    metadata?: Record<string, unknown>;
  }) {
    return this.request('POST', '/api/admin/ecosystem/register-app', appData);
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.apiSecret);
  }
}

export const ecosystemClient = new OrbitEcosystemClient();
