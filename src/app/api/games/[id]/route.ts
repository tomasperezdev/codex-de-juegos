import prisma from '@/lib/prisma';
import { Game } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import * as yup from 'yup';

interface Segments {
  params: {
    id: string;
  }
}

const getGame = async( id: string ):Promise<Game | null> => {

  const game = await prisma.game.findFirst({ where: { id } });

  return game;
}




export async function GET(request: Request, { params }: Segments ) { 

  
  const game = await getGame(params.id);

  if ( !game ) {
    return NextResponse.json({ message: `Game con id ${ params.id } no exite` }, { status: 404 });
  }


  return NextResponse.json(game);
}



const putSchema = yup.object({
  downloaded: yup.boolean().optional(),
  name: yup.string().optional(),
})

export async function PUT(request: Request, { params }: Segments ) { 

  
  const game = await getGame(params.id);

  if ( !game ) {
    return NextResponse.json({ message: `Game con id ${ params.id } no exite` }, { status: 404 });
  }

  try {
    const { downloaded, name } =  await putSchema.validate( await request.json() );
  
  
    const updateGame = await prisma.game.update({
      where: { id: params.id },
      data: { downloaded, name }
    })
  
  
  
    return NextResponse.json(updateGame);
    
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}