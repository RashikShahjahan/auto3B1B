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
        content: `Create a structured educational video script about ${topic}. 
        The script should be a sequence of narration-animation pairs where:
        - narration: Clear, engaging voice transcript explaining the concept
        - animation: Description of what should be visualized.
        
        Each pair should have the animation directly visualizing its corresponding narration.
       `
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