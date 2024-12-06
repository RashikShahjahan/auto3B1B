import { OpenAI } from "openai";
import path from "path";
import fs from "fs";

const openai = new OpenAI();

export async function convertTextToSpeech(text: string): Promise<string> {
  const audioDir = path.join(process.cwd(), 'temp', 'audio');
  const speechFile = path.join(audioDir, 'speech.mp3');

  try {
    await fs.promises.mkdir(audioDir, { recursive: true });
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    return speechFile;
  } catch (error) {
    throw new Error(`Failed to convert text to speech: ${error}`);
  }
} 