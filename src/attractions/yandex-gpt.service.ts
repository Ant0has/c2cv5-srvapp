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
    this.start(); // ← запускаем сразу
  }

  private async start() {
    await this.refreshToken();     // ждём первый токен
    this.isReady = true;
    this.logger.log('Yandex GPT полностью готов к работе');

    // дальше обновляем каждые 50 минут
    setInterval(() => this.refreshToken(), 50 * 60 * 1000);
  }

  private async refreshToken() {
    try {
      const res = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yandexPassportOauthToken: this.oauthToken }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const { iamToken } = await res.json();
      this.iamToken = iamToken;
      this.logger.log('IAM-токен успешно получен');
    } catch (err: any) {
      this.logger.error('Не удалось получить IAM-токен', err.message);
      this.isReady = false;
    }
  }

  async generate(prompt: string): Promise<string> {
    // ждём максимум 12 секунд
    for (let i = 0; i < 60; i++) {
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
        completionOptions: { stream: false, temperature: 0.6, maxTokens: 800 },
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