import { Anthropic } from '@anthropic-ai/sdk';
import { GUIDE, EDIT_GUIDE } from './codePrompts';


const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY 
});



async function generateCode(prompt: string): Promise<string> {
    const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        messages: [
            { role: "user", content: GUIDE },
            { role: "user", content: `${prompt} Only respond with code as plain text without code block syntax around it` }
        ],
    });

    const code = message.content[0].type === 'text' ? message.content[0].text : '';

    return code
        .split('\n')
        .filter((line: string) => 
            !line.startsWith('```') && // Remove code block markers
            line.trim()                // Remove empty lines
        )
        .join('\n')
        .trim();
}

async function editCode(prompt: string, code: string): Promise<string> {

    const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        messages: [
            { role: "user", content: EDIT_GUIDE },
            { role: "user", content: `${prompt} Only respond with code as plain text without code block syntax around it` },
            { role: "user", content: code }
        ],
    });


    const editedCode = message.content[0].type === 'text' ? message.content[0].text : '';
    return editedCode
        .split('\n')
        .filter((line: string) => 
            !line.startsWith('```') && // Remove code block markers
            line.trim()                // Remove empty lines
        )
        .join('\n')
        .trim();
}


export { generateCode, editCode };
