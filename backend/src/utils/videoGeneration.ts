import path from "path";
import fs from "fs";

export async function createVideo(segments: { animationFile: string, audioFile: string }[]): Promise<string> {
    // Filter out null or undefined files and non-existent files
    const validSegments = segments
        .filter(segment => segment.animationFile != null && segment.audioFile != null)
        .filter(segment => fs.existsSync(segment.animationFile) && fs.existsSync(segment.audioFile));

    if (validSegments.length === 0) {
        throw new Error('No valid segments provided');
    }

    // Prepare output
    const outputDir = path.join('temp', 'output');
    await fs.promises.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'final_video.mp4');

    // Prepare FFmpeg command
    const inputs = validSegments.flatMap(segment => 
        [`-i "${segment.animationFile}"`, `-i "${segment.audioFile}"`]
    ).join(' ');
    
    const videoFilters = validSegments.map((_, i) => 
        `[${i*2}:v]setpts=PTS-STARTPTS[v${i}];[${i*2+1}:a]asetpts=PTS-STARTPTS[a${i}];`
    ).join('');
    
    const streamConcat = validSegments.map((_, i) => `[v${i}][a${i}]`).join('');
    
    const ffmpegCommand = `ffmpeg -y ${inputs} -filter_complex "${videoFilters}${streamConcat}concat=n=${validSegments.length}:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" -c:v libx264 -c:a aac "${outputPath}"`;

    // Execute FFmpeg
    return new Promise((resolve, reject) => {
        require('child_process').exec(ffmpegCommand, (error: any, stdout: any, stderr: any) => {
            if (error) reject(new Error(`FFmpeg execution failed: ${error}\nFFmpeg stderr: ${stderr}`));
            else resolve(outputPath);
        });
    });
}
