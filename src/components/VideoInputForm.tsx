import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  ChangeEvent,
  FormEvent,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { fetchWrapperServer } from "@/lib/fetch";
import { StatusContext } from "@/context/status.context";
import { Progress } from "./ui/progress";

interface IVideo {
  video: {
    id: string;
    name: string;
    path: string;
    transcription: string;
    createdAt: string;
  };
}

interface IVideoInputFormProps {
  onVideoUploaded: (videoId: string) => void;
}

const statusMessages = {
  converting: "Convertendo...",
  generating: "Transcrevendo...",
  uploading: "Carregando...",
  success: "Sucesso!",
};

export function VideoInputForm(props: IVideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [progressVideo, setProgressVideo] = useState(0);

  const { status, updateStatusData } = useContext(StatusContext);

  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  async function convertVideoToAudio(video: File) {
    console.log("Convert started.");

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    ffmpeg.on("progress", (progress) => {
      const progressVideo = Math.round(progress.progress * 100);
      setProgressVideo(progressVideo);
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3");

    console.log("convert finished");

    return audioFile;
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedFile = files[0];

    setVideoFile(selectedFile);
    updateStatusData("waiting");
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) return;

    updateStatusData("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);

    updateStatusData("uploading");

    const response = await fetchWrapperServer<IVideo>(
      "videos",
      {
        method: "POST",
        body: data,
      },
      true
    );

    const videoId = response.data.video.id;

    updateStatusData("generating");

    await fetchWrapperServer(`videos/${videoId}/transcription`, {
      method: "POST",
      body: JSON.stringify({ prompt: prompt }),
    });

    updateStatusData("success");

    props.onVideoUploaded(videoId);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null;
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form className="space-y-5" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative border flex w-full rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <>
            <video
              src={previewURL}
              controls={false}
              className={`pointer-events-none absolute inset-0 ${
                progressVideo === 100 ? "brightness-100" : "brightness-50"
              }`}
            />
            <Progress
              value={progressVideo}
              className={`w-[60%] ${progressVideo === 100 ? "hidden" : ""}`}
            />
          </>
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um vídeo
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcription-prompt">Prompt de transcrição</Label>
        <Textarea
          disabled={status !== "waiting"}
          ref={promptInputRef}
          id="transcription-prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por virgula (,)"
        />
      </div>
      <Button
        data-success={status === "success"}
        disabled={status !== "waiting"}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === "waiting" ? (
          <>
            Carregar vídeo <Upload className="h-4 w-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
