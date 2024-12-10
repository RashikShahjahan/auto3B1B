import { OpenAI } from "openai";
import { ScriptOutput } from "../schemas/schema";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

export async function generateVideoScript(topic: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: `Create a narration prompt for an educational video about ${topic}.
        The prompt should guide the narrator to:
        - Use clear, engaging language
        - Explain concepts in a logical sequence
        - Maintain an educational yet conversational tone
        - Keep sentences concise and impactful
        
        Format the output as a series of narration prompts that will later be paired with animations.`
      }],
      response_format: zodResponseFormat(ScriptOutput, "script_output"),
    });
    
    if (!response.choices[0].message) {
      throw new Error('No script generated');
    }
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`Failed to generate video script: ${error}`);
  }
} 

export async function generateNarration(prompt: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
            role: "user",
            content: prompt
        }],
    });
    return response.choices[0].message.content;
}