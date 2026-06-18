export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
}

export const BOOKS: Book[] = [
  { id: 1, title: "Les 4 accords toltèques", author: "Don Miguel Ruiz", category: "Spiritualité" },
  { id: 2, title: "Comment se faire des amis", author: "Dale Carnegie", category: "Relations" },
  { id: 3, title: "Le pouvoir du moment présent", author: "Eckhart Tolle", category: "Spiritualité" },
  { id: 4, title: "L'effet cumulé", author: "Darren Hardy", category: "Productivité" },
  { id: 5, title: "The One Thing", author: "Gary Keller", category: "Productivité" },
  { id: 6, title: "Père riche, père pauvre", author: "Robert Kiyosaki", category: "Finances" },
  { id: 7, title: "Les 7 habitudes des gens efficaces", author: "Stephen Covey", category: "Productivité" },
  { id: 8, title: "Réfléchissez et devenez riche", author: "Napoleon Hill", category: "Mentalité" },
];
