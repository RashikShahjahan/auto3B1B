import { OpenAI } from "openai";
import { ScriptOutput } from "../schemas/schema";
import { zodResponseFormat } from "openai/helpers/zod";
import { CREATE_ANIMATION_PROMPT } from "./codePrompts";

const openai = new OpenAI();

export async function generateVideoScript(topic: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Create a structured educational video script about ${topic}. 
        The script should be a sequence of segments, where each segment can be either:
        1. Narration: Clear, engaging voice transcript explaining the concept
        2. Animation: Description of what should be visualized using the following as a guide: ${CREATE_ANIMATION_PROMPT}.
        Animations should complement the narration and be used to visually represent the concept.
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