import { generateCode, editCode } from './utils/generation';
import { executeAnimationCode } from './utils/execution';

const code = await generateCode('Create an amimation for a pendulum system with a mass on a string');

executeAnimationCode(code);

