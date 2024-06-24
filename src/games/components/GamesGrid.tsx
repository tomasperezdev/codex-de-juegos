"use client";

import { Game } from "@prisma/client";
import { toggleGame } from "@/games/actions/game-actions";
import { GameItemExperimental } from "./GameItemExperiemental";

interface Props {
  games?: Game[];
}

export const GamesGrid = ({ games = [] }: Props) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
      {games.map((game) => (
        <GameItemExperimental
          key={game.id}
          game={game}
          toggleGame={toggleGame}
        />
      ))}
    </div>
  );
};
