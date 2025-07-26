
export interface OutlineSection {
  id: string;
  level: number;
  title: string;
  brief?: string;
}

export interface OutlineData {
  title: string;
  sections: OutlineSection[];
}
