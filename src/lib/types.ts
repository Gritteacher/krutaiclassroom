export type Project = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: "browser" | "users" | "shirt" | "sparkle";
  color: string;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_path: string | null;
  published: boolean;
  published_at: string;
  created_at?: string;
  updated_at?: string;
};
