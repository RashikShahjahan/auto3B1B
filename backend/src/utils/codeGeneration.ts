import { Anthropic } from '@anthropic-ai/sdk';
import { GUIDE } from './codePrompts';
import fs from 'fs';
import path from 'path';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY 
});



async function generateCode(prompt: string, id: string): Promise<string> {
    try {
        const message = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [
            { role: "user", content: GUIDE },
            { role: "user", content: `${prompt} Only respond with code as plain text without code block syntax around it` }
        ],
    });

    const code = message.content[0].type === 'text' ? message.content[0].text : '';

    const cleanedCode = code
        .split('\n')
        .filter((line: string) => 
            !line.startsWith('```') && // Remove code block markers
            line.trim()                // Remove empty lines
        )
        .join('\n')
        .trim();

        return cleanedCode;
    } catch (error) {
        throw new Error(`Failed to generate code: ${error}`);
    }
}

export { generateCode };
