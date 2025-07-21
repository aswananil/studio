'use server';
/**
 * @fileOverview An AI-powered grafting assistance flow.
 *
 * - automatedGraftingAssistance - A function that handles the automated grafting assistance process.
 * - AutomatedGraftingAssistanceInput - The input type for the automatedGraftingAssistance function.
 * - AutomatedGraftingAssistanceOutput - The return type for the automatedGraftingAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedGraftingAssistanceInputSchema = z.object({
  cameraFeedDataUri: z
    .string()
    .describe(
      "A real-time camera feed of the plant stems to be grafted, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  stemDiameterInMillimeters: z
    .number()
    .describe('The diameter of the plant stems, in millimeters.'),
  desiredGraftAngleInDegrees: z
    .number()
    .describe('The desired angle for the graft, in degrees.'),
});
export type AutomatedGraftingAssistanceInput = z.infer<
  typeof AutomatedGraftingAssistanceInputSchema
>;

const AutomatedGraftingAssistanceOutputSchema = z.object({
  optimalGraftingCoordinates: z.object({
    x: z.number().describe('The X coordinate for the graft initiation.'),
    y: z.number().describe('The Y coordinate for the graft initiation.'),
    z: z.number().describe('The Z coordinate for the graft initiation.'),
  }),
  optimalGraftingMomentDescription: z
    .string()
    .describe('A description of the ideal moment to initiate the graft.'),
});
export type AutomatedGraftingAssistanceOutput = z.infer<
  typeof AutomatedGraftingAssistanceOutputSchema
>;

export async function automatedGraftingAssistance(
  input: AutomatedGraftingAssistanceInput
): Promise<AutomatedGraftingAssistanceOutput> {
  return automatedGraftingAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedGraftingAssistancePrompt',
  input: {schema: AutomatedGraftingAssistanceInputSchema},
  output: {schema: AutomatedGraftingAssistanceOutputSchema},
  prompt: `You are an expert horticultural robot specializing in plant grafting.

You will analyze the camera feed of the plant stems and determine the ideal moment and coordinates to initiate the robotic grafting tool.

Consider the stem diameter and desired graft angle to optimize the grafting process.

Provide the optimal grafting coordinates (x, y, z) and a description of the ideal moment to initiate the graft.

Camera Feed: {{media url=cameraFeedDataUri}}
Stem Diameter (mm): {{{stemDiameterInMillimeters}}}
Desired Graft Angle (degrees): {{{desiredGraftAngleInDegrees}}}

Output the response in JSON format.`,
});

const automatedGraftingAssistanceFlow = ai.defineFlow(
  {
    name: 'automatedGraftingAssistanceFlow',
    inputSchema: AutomatedGraftingAssistanceInputSchema,
    outputSchema: AutomatedGraftingAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
