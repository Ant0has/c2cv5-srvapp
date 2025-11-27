import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private readonly apiKey = process.env.YANDEX_OAUTH_TOKEN!;      // ← сюда t1.9euelrq...
  private readonly folderId = process.env.YANDEX_FOLDER_ID!;
  private readonly logger = new Logger(YandexGptService.name);

  constructor() {
    this.logger.log('YandexGPT (API-key) запущен и готов к работе');
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${this.apiKey}`,   // ← именно так
          'x-folder-id': this.folderId,
        },
        body: JSON.stringify({
          modelUri: `gpt://${this.folderId}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: 800,
          },
          messages: [
            {
              role: 'user',
              text: prompt,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Yandex GPT error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.result.alternatives[0].message.text.trim();
  }
}