export const builderDraftKey = "lamda:builder-draft";
export const builderItemsKey = "lamda:builder-items";

export type BuilderDraft = {
  topic: string;
  audience: string;
  duration: string;
  objectives: string;
  builderNotes?: string;
};

export type BuilderLibraryItem = {
  id: string;
  title: string;
  description: string;
  typeLabel: string;
  duration: string;
  groupSize: string;
  objective: string;
  modeLabel: string;
};
