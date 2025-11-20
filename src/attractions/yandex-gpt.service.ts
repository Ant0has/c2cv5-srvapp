import { Injectable } from '@nestjs/common';

@Injectable()
export class YandexGptService {
  private readonly apiKey = process.env.YANDEX_API_KEY;
  private readonly model = 'yandexgpt-lite';

  async generate(prompt: string) {
    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/${this.model}`,
          completionOptions: {
            temperature: 0.3,
            maxTokens: 600,
          },
          messages: [
            {
              role: 'user',
              text: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.result.alternatives[0].message.text;
  }
}
