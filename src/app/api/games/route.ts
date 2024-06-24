
import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import * as yup from 'yup';

export async function GET(request: Request) { 
  
  const { searchParams } = new URL(request.url)
  const take = Number( searchParams.get('take') ?? '10');
  const skip = Number( searchParams.get('skip') ?? '0');

  if ( isNaN(take) ){ 
    return NextResponse.json({ message: 'Take tiene que ser un número' }, { status: 400 });
  }

  if ( isNaN(skip) ){ 
    return NextResponse.json({ message: 'Skip tiene que ser un número' }, { status: 400 });
  }

  const games = await prisma.game.findMany({
    take: take,
    skip: skip,
  });

  return NextResponse.json( games );
}



/* const postSchema = yup.object({
  name: yup.string().required(),
  downloaded: yup.boolean().optional().default(false),
});

export async function POST(request: Request) { 

  try {
    const { downloaded, name } = await postSchema.validate( await request.json() );

    const game = await prisma.game.create({ data: { downloaded, name } })
  
    
    return NextResponse.json(game);
    
  } catch (error) {
    return NextResponse.json( error, { status: 400 } );
  }
}
 */