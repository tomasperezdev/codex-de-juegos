export const dynamic = "force-dynamic";

import { getUserSessionServer } from "@/auth/actions/auth-actions";
import { GamesGrid } from "@/games";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Listado de Juegos",
  description: "Listado de juegos disponibles para utilizar con la IA",
};

export default async function RestTodosPage() {
  const user = await getUserSessionServer();
  if (!user) redirect("/api/auth/signin");

  const games = await prisma.game.findMany();

  return (
    <>
      <span className="text-3xl mb-10">Available Games</span>
      {/*       <div className="w-full px-3 mx-5 mb-5">
        <NewTodo />
      </div> */}

      <GamesGrid games={games} />
    </>
  );
}
