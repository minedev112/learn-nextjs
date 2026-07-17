import { getAuthors } from "@/services/api";
import AuthorCard from "./AuthorCard";

export default async function AuthorsGrid() {
  const authors = await getAuthors();

  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      {authors.map((author) => (
        <AuthorCard
          key={author.id}
          author={author}
        />
      ))}
    </div>
  );
}