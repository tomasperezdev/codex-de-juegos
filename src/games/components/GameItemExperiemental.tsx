"use client";

import { useOptimistic } from "react";

import { Game } from "@prisma/client";
import Image from "next/image";
import {
  IoAddCircleOutline,
  IoChatbox,
  IoDownloadOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { Star } from "@/products/components/Star";
import Link from "next/link";

interface Props {
  game: Game;
  // TODO: Acciones que quiero llamar
  toggleGame: (id: string, downloaded: boolean) => Promise<Game | void>;
}

export const GameItemExperimental = ({ game, toggleGame }: Props) => {
  const [gameOptimistic, toggleOptimistic] = useOptimistic(
    game,
    (state, newCompleteValue: boolean) => ({
      ...state,
      downloaded: newCompleteValue,
    })
  );

  const downloadGameData = async () => {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameToDownload: gameOptimistic.name,
        id: gameOptimistic.id,
      }),
    });
    const updatedGame = await response.json();
    toggleOptimistic(updatedGame);
  };

  return (
    <div className="shadow rounded-lg max-w-sm bg-gray-900 hover:bg-orange-700 border-gray-100">
      <Link
        href={"/dashboard/games/" + gameOptimistic.id}
        className="cursor-pointer"
      >
        <div className="relative aspect-[500/300]">
          <Image
            src={gameOptimistic.logo}
            fill={true}
            className="object-cover p-1 rounded-lg"
            alt="game image"
            sizes="(min-width: 640px) 50vw, 100vw"
          />{" "}
          <p className="font-semibold text-md rounded-lg tracking-tight max-h-full text-white hover:bg-opacity-20 bg-opacity-40 bg-black text-center relative justify-center self-center h-full content-center">
            {gameOptimistic.name}
          </p>
        </div>
      </Link>
      {/* <div className="p-2 w-24 h-24">
        <Image
          fill
          className="rounded"
          src={gameOptimistic.logo}
          alt="product image"
        />
      </div> */}

      {/* Title */}
      {/*<div className="px-5 pb-5">
          <a href="#">
          <h3 className="font-semibold text-xl tracking-tight text-white">
            {gameOptimistic.name}
          </h3>
        </a> 

        {/* <div className="flex">
          <div className="flex">
            {!gameOptimistic.downloaded && <></>}
            <button
              onClick={downloadGameData}
              className="text-white mr-2  focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-800"
            >
              <IoDownloadOutline size={25} />
            </button>
            <Link
              href={"/dashboard/games/" + gameOptimistic.id}
              className="text-white flex focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-orange-600 hover:bg-orange-700 focus:ring-orange-800"
            >
              <button>
                <IoChatbox size={20} />
              </button>
            </Link>
          </div> 
        </div>
      </div>*/}
    </div>
  );
};
