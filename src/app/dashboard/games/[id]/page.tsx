"use client";

import { Game } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Message, useChat } from "@ai-sdk/react";
import { ToolInvocation } from "ai";
import { getGame } from "@/games/actions/game-actions";
import Image from "next/image";
import { hourglass } from "ldrs";
import { IoPaperPlane, IoReload, IoTimeSharp } from "react-icons/io5";
import Link from "next/link";
import LOGO from "../../../../assets/codexLogo.png";
import { setCookie } from "cookies-next";

hourglass.register();

export default function RestTodosPage() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const [chatId, setChatId] = useState<number | undefined>(undefined);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const [game, setGame] = useState<Game | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    isLoading,
    setInput,
    error,
  } = useChat({
    id: chatId?.toString(),
  });

  useEffect(() => {
    const findGame = async (id: string | undefined) => {
      if (!id) return;
      const gameInfo = await getGame(id);
      setGame(gameInfo);
      setCookie("currentGame", gameInfo.name);
    };
    findGame(id);
  }, [id]);

  const quickAccessClicked = async (toolName: string) => {
    if (!game) return;
    const gameName = game.name;
    const message = `What is the ${toolName} for ${gameName}`;
    setInput(message);
    if (sendButtonRef.current) sendButtonRef.current.click();
  };

  const resetUseChat = () => {
    setChatId((chatId) => (chatId ?? 0) + 1);
  };

  return (
    <>
      <Link
        href={"/dashboard/games/"}
        className="font-medium rounded-lg text-smtext-center text-orange-600"
      >
        <button>Games /</button>
      </Link>
      <span className="text-2xl"> {game?.name}</span>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        <div className=" col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mt-4 items-center">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 sm:grid-cols-6 gap-1 items-center justify-center center">
                  <button
                    onClick={() => quickAccessClicked("Setup")}
                    type="submit"
                    className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-blue-600 col-span-2"
                  >
                    Setup
                  </button>
                  <button
                    onClick={() => quickAccessClicked("Scoring")}
                    className="bg-gray-600 text-white px-4 py-2 rounded-full ml-3 hover:bg-blue-600 col-span-2"
                  >
                    Scoring
                  </button>
                  <button
                    onClick={() => quickAccessClicked("Overview")}
                    className="bg-gray-600 text-white px-4 py-2 rounded-full ml-3 hover:bg-blue-600 col-span-2"
                  >
                    Overview
                  </button>
                  <div className="col-span-4 col-start-1">
                    <input
                      onChange={handleInputChange}
                      value={input}
                      type="text"
                      placeholder="Type your message..."
                      className="w-full py-2 px-4 mt-2 rounded-full bg-gray-200 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 items-center text-center">
                    {/*                     <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 hidden sm:block"
                    >
                      Send
                    </button> */}
                    <button
                      ref={sendButtonRef}
                      type="submit"
                      className="bg-blue-500 text-white px-2 mr-4 py-2 rounded-full hover:bg-blue-600"
                    >
                      <IoPaperPlane />
                    </button>
                    <button
                      className="bg-orange-500 text-white px-2 py-2 rounded-full hover:bg-orange-600"
                      onClick={resetUseChat}
                    >
                      <IoReload />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {error && (
              <>
                <IoTimeSharp className="text-red-500" size="40" />
                {error?.message.toString()}
              </>
            )}
            {isLoading && (
              <l-hourglass
                size="40"
                bg-opacity="0.1"
                speed="1.75"
                color="black"
              ></l-hourglass>
            )}
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-1 items-center justify-center"></div>
            <div className="mt-4">
              {messages
                ?.map((m: Message) => (
                  <div key={m.id}>
                    {m.role === "user" ? (
                      <div className="flex items-end justify-end" key={m.id}>
                        <div className="bg-blue-500 p-3 rounded-lg">
                          <p className="text-sm text-white">
                            {m.content?.toString()}
                          </p>
                        </div>
                        <Image
                          width={40}
                          height={40}
                          src="https://lh3.googleusercontent.com/ogw/AF2bZyigXM3F-fabwb_uUmCEQ8g1tOWnDzWrvKbl-_1gKGHXuFk=s32-c-mo"
                          alt="Other User Avatar"
                          className="rounded-full ml-3"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4" key={m.id}>
                        <div className="flex items-start">
                          <Image
                            width={40}
                            height={40}
                            src={LOGO}
                            alt="Other User Avatar"
                            className="rounded-full ml-3"
                          />
                          <div className="ml-3 bg-gray-100 p-3 rounded-lg">
                            <p className="text-sm text-gray-800">
                              {m.content?.toString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {m.toolInvocations?.map(
                      (toolInvocation: ToolInvocation) => {
                        const toolCallId = toolInvocation.toolCallId;
                        const addResult = (result: string) =>
                          addToolResult({ toolCallId, result });
                        // other tools:
                        return "result" in toolInvocation ? (
                          <div key={toolCallId}>
                            Tool call {`${toolInvocation.toolName}: `}
                            {toolInvocation.result}
                          </div>
                        ) : (
                          <div key={toolCallId}>
                            Something went wrong,{" "}
                            <span
                              className="text-orange"
                              onClick={resetUseChat}
                            >
                              reset
                            </span>{" "}
                            the chat and try again
                          </div>
                        );
                      }
                    )}
                    <br />
                  </div>
                ))
                .reverse()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
