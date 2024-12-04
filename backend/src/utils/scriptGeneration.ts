import { OpenAI } from "openai";
const openai = new OpenAI();
import { ScriptOutput } from "../schemas/schema";
import { zodResponseFormat } from "openai/helpers/zod";


export async function generatePhysicsScript(topic: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
        role: "user",
        content: `Create a structured educational video script about ${topic}. 
        The script should be a sequence of segments, where each segment can be either:
        1. Narration: Clear, engaging voice transcript explaining the concept
        2. Animation: Description of what should be visualized
        
        You can alternate between narration and animation freely - they don't need to be paired.
        Keep each segment focused and concise.`
      }],
      response_format: zodResponseFormat(ScriptOutput, "script_output"),
    });

    return response.choices[0].message;
}






