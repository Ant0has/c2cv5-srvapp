// src/attractions/yandex-gpt.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private readonly apiKey = process.env.YANDEX_API_KEY;           // YCAJEQZjbjpJYHeyBeZk_tujA
  private readonly folderId = process.env.YANDEX_FOLDER_ID;        // b1gqrulpto2jc6totiju
  private readonly model = 'yandexgpt-lite';

  async generate(prompt: string): Promise<string> {
    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${this.apiKey}`,
          'x-folder-id': this.folderId,
        },
        body: JSON.stringify({
          modelUri: `gpt://${this.folderId}/${this.model}`,
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