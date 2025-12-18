export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  year: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}
