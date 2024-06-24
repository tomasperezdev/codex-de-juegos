import { NextResponse, NextRequest } from 'next/server'
import * as yup from 'yup';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { z } from 'zod';
import gamesRulebookData from "../../../../downloads/rulebooksDownloaded.json";

const postSchema = yup.object({
  game: yup.string().required(),
  chatHistory: yup.array().of(yup.object({
    role: yup.string().required(),
    content: yup.string().required(),
  })).required(),
  //complete: yup.boolean().optional().default(false),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  //const { game,chatHistory } = await postSchema.validate( await request.json() );
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: convertToCoreMessages(messages),
    tools: {
      getInformationFromRules: {
        description:
          "Get information about the setup instructions from the rulebook, mentioning what page of the rulebook they can find the information on.",
        parameters: z.object({}),
        execute: async function* () {
          return gamesRulebookData["Wyrmspan"]
        },
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      getQuickSetup: {
        description:
          'Get the game setup information. Always ask for confirmation before using this tool.',
        parameters: z.object({}),
      },
    },
  });

  return result.toAIStreamResponse();
}