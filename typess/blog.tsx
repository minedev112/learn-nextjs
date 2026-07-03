export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  category_id: number;
  author_id: number;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
}