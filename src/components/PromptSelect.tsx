import { fetchWrapperServer } from "@/lib/fetch";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface IPrompt {
  id: string;
  template: string;
  title: string;
}

interface IPromptsArray extends Array<IPrompt> {}

interface PromptSelectProps {
  disabled: boolean;
  onPromptSelected: (template: string) => void;
}

export function PromptSelect(props: PromptSelectProps) {
  const [prompts, setPrompts] = useState<IPromptsArray>([]);

  useEffect(() => {
    fetchWrapperServer<IPromptsArray>("prompts").then((response) => {
      setPrompts(response.data);
    });
  }, []);

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId);
    if (!selectedPrompt) return;
    props.onPromptSelected(selectedPrompt?.template);
  }

  return (
    <Select disabled={props.disabled} onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts.map((prompt) => {
          return (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
