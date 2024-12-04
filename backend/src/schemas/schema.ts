import { z } from "zod";

export const ScriptSegment = z.object({
  type: z.enum(['narration', 'animation']),
  content: z.string().describe("Content for the segment (either narration transcript or animation prompt)")
});

export const ScriptOutput = z.object({
  segments: z.array(ScriptSegment).describe("Array of script segments")
});


