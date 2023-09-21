import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Separator } from "@radix-ui/react-separator";
import { Slider } from "@radix-ui/react-slider";
import { Wand2 } from "lucide-react";
import { PromptSelect } from "./PromptSelect";
import { VideoInputForm } from "./VideoInputForm";
import { Button } from "./ui/button";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { StatusContext } from "@/context/status.context";

interface IActionsProps {
  setInput: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  onHandleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  temperature: number;
  onSetTemperature: (value: number) => void;
  onSetVideoId: (id: string) => void;
}

export function Actions(props: IActionsProps) {
  const { status, updateStatusData } = useContext(StatusContext);

  useEffect(() => {
    if (props.isLoading) updateStatusData("waiting");
  }, [props.isLoading]);

  return (
    <aside className="w-80 space-y-6">
      <VideoInputForm onVideoUploaded={(value) => props.onSetVideoId(value)} />
      <Separator />
      <form className="space-y-4" onSubmit={props.onHandleSubmit}>
        <div className="space-y-2">
          <Label>Prompt</Label>
          <PromptSelect
            onPromptSelected={props.setInput}
            disabled={props.isLoading === true}
          />
        </div>

        <div className="space-y-2">
          <Label>Modelo</Label>
          <Select disabled defaultValue="gtp3.5">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gtp3.5">GPT 3.5-turbo 16k</SelectItem>
            </SelectContent>
          </Select>
          <span className="block text-xs text-muted-foreground italic">
            Você poderá customizar essa opção em breve
          </span>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Temperatura</Label>
          <Slider
            disabled={props.isLoading === true}
            min={0}
            max={1}
            step={0.1}
            value={[props.temperature]}
            onValueChange={(value) => props.onSetTemperature(value[0])}
          />
          <span className="block text-xs text-muted-foreground italic leading-relaxed">
            Valores mais altos tendem a deixar o resultado mais criativo e com
            possíveis erros
          </span>
        </div>

        <Separator />

        <Button
          disabled={props.isLoading === true || status !== "success"}
          type="submit"
          className="w-full"
        >
          Executar <Wand2 className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </aside>
  );
}
