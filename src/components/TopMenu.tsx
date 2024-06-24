import LOGO from "../assets/codexLogo.png";
import Image from "next/image";

export const TopMenu = () => {
  return (
    <div className="sticky z-10 top-0 h-16 border-b bg-white lg:py-2.5">
      <div className="px-2 flex items-center justify-between space-x-2">
        <button className="w-12 h-16 border-r lg:hidden">
          <Image
            src={LOGO}
            className="w-12"
            alt="CODEX logo"
            width={150}
            height={150}
          />
        </button>
        <h5 className="text-2xl text-gray-600 font-medium">Codex de Juegos</h5>
      </div>
    </div>
  );
};
