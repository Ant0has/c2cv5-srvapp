// src/attractions/yandex-gpt.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private iamToken: string;
  private readonly folderId = 'b1gqrulpto2jc6totiju';
  private readonly oauthToken = 'YCO6D-5Sk1ZtBLyAakosoLhT-cQ-Sod_hkJcw8P'; // ← твой рабочий OAuth-токен
  private readonly logger = new Logger(YandexGptService.name);

  constructor() {
    this.updateIamToken();
    // Обновляем токен каждые 50 минут
    setInterval(() => this.updateIamToken(), 50 * 60 * 1000);
  }

  private async updateIamToken() {
    try {
      const res = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yandexPassportOauthToken: this.oauthToken }),
      });
      const data = await res.json();
      this.iamToken = data.iamToken;
      this.logger.log('Yandex IAM token updated');
    } catch (err) {
      this.logger.error('Failed to get IAM token', err);
    }
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.iamToken}`,
          'x-folder-id': this.folderId,
        },
        body: JSON.stringify({
          modelUri: `gpt://${this.folderId}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 800,
          },
          messages: [{ role: 'user', text: prompt }],
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Yandex GPT error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.result.alternatives[0].message.text.trim();
  }
}