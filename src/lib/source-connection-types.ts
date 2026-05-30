export type SpreadsheetFile = {
  id: string;
  name: string;
  url: string;
};

export type SheetConnection = {
  id: string;
  type: "sheet" | "folder";
  name: string;
  url: string;
  files?: SpreadsheetFile[];
};
