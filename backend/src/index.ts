import { generateCode, editCode } from './utils/generation';
import { executeAnimationCode } from './utils/execution';

const code = await generateCode('Create an amimation for a projectile motion');
console.log(code);


executeAnimationCode(code);

