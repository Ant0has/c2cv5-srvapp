// src/attractions/yandex-gpt.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private iamToken = '';
  private readonly folderId = process.env.YANDEX_FOLDER_ID!;
  private readonly oauthToken = process.env.YANDEX_OAUTH_TOKEN!;
  private readonly logger = new Logger(YandexGptService.name);
  private isReady = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    await this.refreshToken();
    this.isReady = true;
    this.logger.log('Yandex GPT полностью готов к работе');

    // Обновляем токен каждые 50 минут
    setInterval(() => this.refreshToken(), 50 * 60 * 1000);
  }

  private async refreshToken() {
    try {
      const res = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yandexPassportOauthToken: this.oauthToken }),
      });

      if (!res.ok) throw new Error(`IAM request failed: ${await res.text()}`);

      const { iamToken } = await res.json();
      this.iamToken = iamToken;
      this.logger.log('IAM-токен успешно получен/обновлён');
    } catch (err) {
      this.logger.error('Ошибка получения IAM-токена', err);
      this.isReady = false;
    }
  }

  async generate(prompt: string): Promise<string> {
    // Ждём максимум 10 секунд (больше не нужно — токен приходит за 1–2 сек)
    for (let i = 0; i < 50; i++) {
      if (this.isReady && this.iamToken) break;
      await new Promise(r => setTimeout(r, 200));
    }

    if (!this.iamToken) {
      throw new Error('Yandex GPT недоступен: IAM-токен не получен');
    }

    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.iamToken}`,
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
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Yandex GPT error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.result.alternatives[0].message.text.trim();
  }
}