export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export interface Session {
  user: User;
}

