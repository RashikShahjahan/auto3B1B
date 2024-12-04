import { generateCode, editCode } from './utils/generation';
import { executeAnimationCode } from './utils/execution';

const code = await generateCode('Animation for a spring-mass system');
console.log(code);


executeAnimationCode(code);

