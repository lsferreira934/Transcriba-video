import { Github, Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";

import { useState } from "react";
import { useCompletion } from "ai/react";

import { Drawer } from "./components/Drawer";
import { Actions } from "./components/Actions";

export function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>();
  const [openSide, setOpenSide] = useState(false);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: `${import.meta.env.VITE_APP_API_SERVER}/ai/generate`,
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Transcriba-video</h1>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💙 💚 💛
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
        <div className="flex md:hidden">
          <Button
            className="w-auto h-0 p-0 m-0"
            variant="ghost"
            onClick={() => setOpenSide(!openSide)}
          >
            <Menu className="" />
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              value={completion}
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável{" "}
            <code className="text-violet-400">{"{transcription}"}</code> no seu
            prompt para adicionar o conteúdo da transcrição do vídeo
            selecionado.
          </p>
        </div>
        <Drawer openSide={openSide} onSetOpenSide={setOpenSide}>
          <Actions
            setInput={setInput}
            onHandleSubmit={handleSubmit}
            isLoading={isLoading}
            temperature={temperature}
            onSetTemperature={setTemperature}
            onSetVideoId={setVideoId}
          />
        </Drawer>
      </main>
    </div>
  );
}
