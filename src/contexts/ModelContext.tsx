import { createContext, useContext, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type AppModel = "box" | "home" | "work";

interface ModelContextType {
  currentModel: AppModel;
  modelLabel: string;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

const modelLabels: Record<AppModel, string> = {
  box: "Droppi Box",
  home: "Droppi Home",
  work: "Droppi Work",
};

function getModelFromPath(pathname: string): AppModel {
  if (pathname.startsWith("/box")) return "box";
  if (pathname.startsWith("/work")) return "work";
  return "home";
}

export function ModelProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const currentModel = getModelFromPath(location.pathname);
  const modelLabel = modelLabels[currentModel];

  return (
    <ModelContext.Provider value={{ currentModel, modelLabel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
}
