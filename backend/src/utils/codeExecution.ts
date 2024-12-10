import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const VENV_PATH = path.join(__dirname, '..', '..', 'animation', 'venv');

export function containsMaliciousCode(code: string): boolean {
    const dangerousPatterns = [
      /import\s+os/,
      /import\s+sys/,
      /import\s+subprocess/,
      /from\s+os\s+import/,
      /from\s+sys\s+import/,
      /from\s+subprocess\s+import/,
      /open\(/,
      /exec\(/,
      /eval\(/,
      /Popen\(/,
      /environ\[/,
      /process\./,
      /child_process/,
      /spawn\(/,
      /fork\(/,
      /\.system\(/,
      /\.popen\(/,
      /\.call\(/,
    ];

    const normalizedCode = code.replace(/\\\s*\n/g, '');
    return dangerousPatterns.some(pattern => pattern.test(normalizedCode));
  } 


export async function executeAnimationCode(code: string, id: string) {
    if (containsMaliciousCode(code)) {
        throw new Error('Potentially malicious code detected');
    }

    const filepath = path.join(process.cwd(), 'temp', `animation_${id}.py`);
    await fs.promises.writeFile(filepath, code);

    try {
        const pythonPath = path.join(VENV_PATH, 'bin', 'python');
        
        await execAsync(`"${pythonPath}" -m manim -pql ${filepath} AnimationName`, {
            timeout: 60000,
            maxBuffer: 10 * 1024 * 1024, // 10MB output limit
            env: {
                PATH: `${path.join(VENV_PATH, 'bin')}:${process.env.PATH}`,
                FFMPEG_BINARY: '/usr/bin/ffmpeg',
                PYTHONPATH: path.dirname(VENV_PATH),
                PYTHONIOENCODING: 'utf-8',
                PYTHONUTF8: '1',
                PYTHONUNBUFFERED: '1',
                PYTHONDONTWRITEBYTECODE: '1',
            },
            cwd: path.join(process.cwd(), 'temp')
        });
        
        return path.join(process.cwd(), 'temp', 'media', 'videos', `animation_${id}`, '480p15', 'AnimationScene.mp4');
    } catch (error) {
        console.error('Error executing animation code:', error);
        throw error;
    } 
}