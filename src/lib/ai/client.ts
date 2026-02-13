import type { AISettings } from '../types';

export class AIClient {
    static async callLLM(prompt: string, settings: AISettings): Promise<string> {
        if (!settings.apiKey) {
            throw new Error('API Key is missing');
        }

        const baseUrl = settings.apiBaseUrl || 'https://api.openai.com/v1';
        const url = `${baseUrl}/chat/completions`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.apiKey}`
                },
                body: JSON.stringify({
                    model: settings.model || 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional productivity coach. Analyze the user\'s browsing data and provide concise, motivating insights.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('AI Client Error:', error);
            throw error;
        }
    }
}
