import path from "path";
import fs from "fs";

export async function createVideo(animationFiles: string[], audioFiles: string[]): Promise<string> {
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
}
