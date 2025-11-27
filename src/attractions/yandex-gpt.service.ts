// src/attractions/yandex-gpt.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private iamToken = '';
  private readonly folderId = 'b1gqrulpto2jc6totiju';
  private readonly oauthToken = 'YCO6D-5Sk1ZtBLyAakosoLhT-cQ-Sod_hkJcw8P';
  private readonly logger = new Logger('YandexGptService');

  constructor() {
    this.refreshToken();
    setInterval(() => this.refreshToken(), 50 * 60 * 1000);
  }

  private async refreshToken() {
    try {
      const res = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
        method: 'POST',
        body: JSON.stringify({ yandexPassportOauthToken: this.oauthToken }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      this.iamToken = data.iamToken;
      this.logger.log('IAM token обновлён');
    } catch (e) {
      this.logger.error('Не удалось получить IAM token', e);
    }
  }

  async generate(prompt: string): Promise<string> {
    if (!this.iamToken) throw new Error('IAM token not ready yet');

    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.iamToken}`,
        'x-folder-id': this.folderId,
      },
      body: JSON.stringify({
        modelUri: `gpt://${this.folderId}/yandexgpt-lite`,
        completionOptions: { stream: false, temperature: 0.6, maxTokens: 800 },
        messages: [{ role: 'user', text: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Yandex GPT error ${res.status}: ${err}`);
    }

    const json = await res.json();
    return json.result.alternatives[0].message.text.trim();
  }
}