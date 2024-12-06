import { z } from "zod";
import { CREATE_ANIMATION_PROMPT } from "../utils/codePrompts";

export const ScriptSegmentPair = z.object({
  narration: z.string().describe("Clear, engaging narration explaining the concept"),
  animation: z.string().describe(`Description of what should be visualized using the following as a guide: ${CREATE_ANIMATION_PROMPT}. No code, just a description.`),
});

export const ScriptOutput = z.object({
  segments: z.array(ScriptSegmentPair).describe("Array of narration-animation pairs")
});

export type ScriptSegmentPair = z.infer<typeof ScriptSegmentPair>;
export type ScriptOutput = z.infer<typeof ScriptOutput>;