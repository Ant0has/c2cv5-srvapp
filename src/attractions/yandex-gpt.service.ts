import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private readonly apiKey = process.env.YANDEX_OAUTH_TOKEN!; 
  private readonly folderId = process.env.YANDEX_FOLDER_ID!;
  private readonly logger = new Logger(YandexGptService.name);

  constructor() {
    this.logger.log('Yandex GPT (API-key mode) готов к работе');
  }

  async generate(prompt: string): Promise<string> {
    const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${this.apiKey}`,
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