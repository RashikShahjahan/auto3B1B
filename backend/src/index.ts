import { generatePhysicsScript } from './utils/scriptGeneration';
import { executeAnimationCode } from './utils/codeExecution';

const script = await generatePhysicsScript('spring-mass system');
console.log(script);



