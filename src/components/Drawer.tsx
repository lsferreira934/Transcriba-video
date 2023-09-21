import { XSquare, Github } from "lucide-react";
import { Button } from "./ui/button";

interface IDrawerProps {
  children: React.ReactNode;
  openSide: boolean;
  onSetOpenSide: (valeu: boolean) => void;
}

export function Drawer(props: IDrawerProps) {
  return (
    <div
      className={`md:static fixed top-0 p-3 max-h-screen ${
        props.openSide
          ? "right-0 transform translate-x-0"
          : "flex-none right-[0%] translate-x-full md:translate-x-0"
      }  duration-300 bg-gray-700 h-full w-auto md:max-h-0 md:top-auto md:p-0`}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-0">
        <Button
          variant="ghost"
          className="w-auto h-0 p-0 m-0 md:hidden"
          onClick={() => props.onSetOpenSide(!props.openSide)}
        >
          <XSquare className="w-auto" />
        </Button>
        <Button className="md:hidden" variant="outline">
          <Github className="w-4 h-4 mr-2" />
          Github
        </Button>
      </div>
      {props.children}
    </div>
  );
}
