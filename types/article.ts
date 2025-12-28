// types/article.ts
export interface Article {
  id: string;
  title: string;
  status: string; // draft, published, archived
  content: string;
  created_at: Date;
  updated_at: Date;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  articles?: Article[];
}