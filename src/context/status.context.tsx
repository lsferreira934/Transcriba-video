import { createContext, useState } from "react";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";

interface IStateData {
  status: Status;
  updateStatusData: (status: Status) => void;
}

export const StatusContext = createContext({} as IStateData);

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("waiting");

  function updateStatusData(status: Status) {
    setStatus(status);
  }

  return (
    <StatusContext.Provider value={{ status, updateStatusData }}>
      {children}
    </StatusContext.Provider>
  );
}
