import { generatePhysicsScript,convertTextToSpeech } from './utils/scriptGeneration';
import { executeAnimationCode } from './utils/codeExecution';

const script = await generatePhysicsScript('spring-mass system');
console.log(script);



convertTextToSpeech(script.content ?? '');
