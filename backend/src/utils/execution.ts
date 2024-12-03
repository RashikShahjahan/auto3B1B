import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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


export async function executeAnimationCode(code: string){
    const uniqueId = crypto.randomBytes(4).toString('hex');
    
    const codeFilePath = path.join(__dirname, '..', '..', 'animation','output', `generated_animation_script_${uniqueId}.py`);
  
    await fs.promises.mkdir(path.dirname(codeFilePath), { recursive: true });
  
    if (containsMaliciousCode(code)) {
      throw new Error('Code contains potentially unsafe operations');
    }
  
    await fs.promises.writeFile(codeFilePath, code);
  
    try {
      const pythonPath = path.join(__dirname, '..', '..', 'animation', 'venv', 'bin', 'python');
      await execAsync(`"${pythonPath}" "${codeFilePath}"`, {
        timeout: 30000,
        maxBuffer: 1024 * 1024, // 1MB output limit
        env: {
          PATH: path.join(__dirname, '..', '..', 'animation', 'venv', 'bin'),
          PYTHONPATH: path.join(__dirname, '..', '..', 'animation'),
          PYTHONIOENCODING: 'utf-8',
          PYTHONUTF8: '1',
          PYTHONUNBUFFERED: '1',
          PYTHONDONTWRITEBYTECODE: '1',
          PYTHONHOME: undefined,
          PYTHONSTARTUP: undefined,
          PYTHONPATH_ORIG: undefined,
          HOME: undefined,
          USER: undefined,
        },
        cwd: path.dirname(codeFilePath)
      });
  
    } catch (error) {
      console.error('Error executing animation code:', error);
      throw error;
    }
  }