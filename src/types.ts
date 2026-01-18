export type Status = "planned" | "doing" | "done";

export type CardType = {
  id: string;
  title: string;
  hypothesis: string;
  success: string;
  status: Status;
  result: string;
  learning: string;
};

export type ClosingDraft = {
  result: string;
  learning: string;
};

export type ClosingMap = Record<string, ClosingDraft>;
export type ClosingPatch = Partial<ClosingDraft>;
