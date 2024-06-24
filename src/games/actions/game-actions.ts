'use server';

import prisma from "@/lib/prisma";
import { Game } from "@prisma/client";
import { revalidatePath } from "next/cache";


const sleep = (seconds: number = 0 ): Promise<boolean> => {
  return new Promise( (resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000 );
  });
}

export const toggleGame = async( id: string, downloaded: boolean ): Promise<Game> => {
  
  await sleep(1);
  
  const game = await prisma.game.findFirst({ where: { id } });

  if ( !game ) {
    throw `Game con id ${ id } no encontrado`;
  }

  const updatedTodo = await prisma.game.update({ where: { id }, data:{ downloaded }});
  revalidatePath('/dashboard/games');
  return updatedTodo;

}

export const getGame = async( id: string ): Promise<Game> => {
  const game = await prisma.game.findFirst({ where: { id } });
  if ( !game ) {
    throw `Game con id ${ id } no encontrado`;
  }
  return game;
}


/* export const createGame = async( name: string, id: string ) => {
  const todo = await prisma.game.create({ data: { name, id: '...' } });
  revalidatePath('/dashboard/server-todos');

  return todo;
} */
 

/* export const deleteCompleted = async() => {
  await prisma.todo.deleteMany({ where: { complete: true }});
  revalidatePath('/dashboard/server-todos');

} */
