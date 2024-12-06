import path from "path";
import fs from "fs";
import { uploadBufferToBucket } from "./s3";

export async function createVideo(segments: { animationFile: string, narrationFile: string }[]): Promise<string> {
  try {
    // Check for null segments first
    if (segments.some(segment => !segment || !segment.animationFile || !segment.narrationFile)) {
      throw new Error('Invalid segment: all segments must have both animationFile and narrationFile');
    }

    const outputDir = path.join('temp', 'output');
    await fs.promises.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'final_video.mp4');

    // Prepare FFmpeg command
    const inputs = segments.flatMap(segment => 
        [`-i "${segment.animationFile}"`, `-i "${segment.narrationFile}"`]
    ).join(' ');
    
    const videoFilters = segments.map((_, i) => 
        `[${i*2}:v]setpts=PTS-STARTPTS[v${i}];[${i*2+1}:a]asetpts=PTS-STARTPTS[a${i}];`
    ).join('');
    
    const streamConcat = segments.map((_, i) => `[v${i}][a${i}]`).join('');
    
    const ffmpegCommand = `ffmpeg -y ${inputs} -filter_complex "${videoFilters}${streamConcat}concat=n=${segments.length}:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" -c:v libx264 -c:a aac "${outputPath}"`;

    // Execute FFmpeg
    await new Promise((resolve, reject) => {
        require('child_process').exec(ffmpegCommand, (error: any, stdout: any, stderr: any) => {
            if (error) reject(new Error(`FFmpeg execution failed: ${error}\nFFmpeg stderr: ${stderr}`));
            else resolve(outputPath);
        });
    });

    // Read the video file and upload to S3
    const videoBuffer = await fs.promises.readFile(outputPath);
    const s3Key = `output-videos/${path.basename(outputPath)}`;
    await uploadBufferToBucket({
      bucketName: 'auto-3b1b',
      buffer: videoBuffer,
      key: s3Key
    });

    // Clean up local file
    await fs.promises.unlink(outputPath);

    return s3Key;
  } catch (error) {
    throw new Error(`Failed to create video: ${error}`);
  }
}