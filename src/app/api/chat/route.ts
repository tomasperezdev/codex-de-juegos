import { NextResponse, NextRequest } from 'next/server'
import * as yup from 'yup';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { z } from 'zod';
import gamesRulebookData from "../../../../downloads/rulebooksDownloaded.json";
import { cookies } from 'next/headers';

const postSchema = yup.object({
  messages: yup.array().of(yup.object({
    role: yup.string().required(),
    content: yup.string().required(),
  })).required(),
  //complete: yup.boolean().optional().default(false),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {

  const cookieStore = cookies()
  const currentGame = cookieStore.get('currentGame')?.value
  console.log('currentGame', currentGame)
  //const { game,chatHistory } = await postSchema.validate( await request.json() );
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    system:`Use the following json data to answer the questions and gather the overview, setup and scoring information: ${JSON.stringify(gamesRulebookData[currentGame])}`,
    tools: {
      answerSpecificQuestion: {
        description:
          "Answer a specific question about the game rules based on the game rulebook, mentioning what page of the rulebook they can find the information on.",
        parameters: z.object({ ruleBook: z.object({}) }),
      },
      /* getQuickSetup: {
        description:
          "Get information about the setup instructions from the rulebook, mentioning what page of the rulebook they can find the information on.",
        parameters: z.object({ ruleBook: z.object({}) }),
      },
      getOverview: {
        description:
          "Give an overview of the game objective, winning condition and mechanics, as an overview",
        parameters: z.object({ ruleBook: z.object({}) }),
      },
      getScoring: {
        description:
          "Explain how the scoring works in the game, mentioning what page of the rulebook they can find the information on.",
        parameters: z.object({ ruleBook: z.object({}) }),
      }, */
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
    },
  });

  return result.toAIStreamResponse();
}