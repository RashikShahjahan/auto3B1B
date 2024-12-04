import { OpenAI } from "openai";
const openai = new OpenAI();
import { ScriptOutput, ScriptSegment } from "../schemas/schema";
import { zodResponseFormat } from "openai/helpers/zod";
import path from "path";
import fs from "fs";
import { generateCode } from "./codeGeneration";
import { executeAnimationCode } from "./codeExecution";
import { CREATE_ANIMATION_PROMPT } from "./codePrompts";

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

export async function generateVideoScript(topic: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: `Create a structured educational video script about ${topic}. 
        The script should be a sequence of segments, where each segment can be either:
        1. Narration: Clear, engaging voice transcript explaining the concept
        2. Animation: Description of what should be visualized using the following as a guide: ${CREATE_ANIMATION_PROMPT}.
        
       `
      }],
      response_format: zodResponseFormat(ScriptOutput, "script_output"),
    });
    
    if (!response.choices[0].message) {
      throw new Error('No script generated');
    }
    return response.choices[0].message;
  } catch (error) {
    throw new Error(`Failed to generate video script: ${error}`);
  }
}



async function findMp4File(baseDir: string): Promise<string | null> {
  try {
    const generatedDirs = await fs.promises.readdir(baseDir);
    for (const dir of generatedDirs) {
      const videoDir = path.join(baseDir, dir, '480p15');
      try {
        const files = await fs.promises.readdir(videoDir);
        const mp4File = files.find(file => file.endsWith('.mp4'));
        if (mp4File) {
          return path.join(videoDir, mp4File);
        }
      } catch (error) {
        continue; // Skip if directory doesn't exist or can't be read
      }
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to find MP4 file: ${error}`);
  }
}

export async function createVideo(topic: string): Promise<string> {
  try {
    const script = await generateVideoScript(topic);
    const segments = JSON.parse(script.content ?? '').segments;
    const animationFiles: string[] = [];

    // Process animations
    for (const segment of segments) {
      if (segment.type === "animation") {
        try {
          const animation = await generateCode(segment.content);
          const hash = await executeAnimationCode(animation);
          const baseDir = path.join(process.cwd(), 'temp', `attempt_${hash}`, 'media', 'videos');
          const mp4Path = await findMp4File(baseDir);
          
          if (mp4Path) {
            animationFiles.push(mp4Path);
          }
        } catch (error) {
          console.error("Animation processing failed:", error);
        }
      }
    }

    if (animationFiles.length === 0) {
      throw new Error('No animation files were generated successfully');
    }

    // Generate audio
    const narrationText = segments
      .filter((segment: ScriptSegment) => segment.type === "narration")
      .map((segment: ScriptSegment) => segment.content)
      .join(" ");
    await convertTextToSpeech(narrationText);

    // Prepare output
    const outputDir = path.join('temp', 'output');
    await fs.promises.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'final_video.mp4');

    // Prepare FFmpeg command
    const videoInputs = animationFiles.map(file => `-i "${file}"`).join(' ');
    const videoFilters = animationFiles.map((_, i) => `[${i}:v]setpts=PTS-STARTPTS[v${i}];`).join('');
    const videoConcat = animationFiles.map((_, i) => `[v${i}]`).join('');
    
    const ffmpegCommand = `ffmpeg -y ${videoInputs} -i "temp/audio/speech.mp3" -filter_complex "${videoFilters}${videoConcat}concat=n=${animationFiles.length}:v=1:a=0[outv]" -map "[outv]" -map ${animationFiles.length}:a -c:v libx264 -c:a aac "${outputPath}"`;

    // Execute FFmpeg
    return new Promise((resolve, reject) => {
      require('child_process').exec(ffmpegCommand, (error: any, stdout: any, stderr: any) => {
        if (error) reject(new Error(`FFmpeg execution failed: ${error}`));
        else resolve(outputPath);
      });
    });
  } catch (error) {
    throw new Error(`Video creation failed: ${error}`);
  }
}
