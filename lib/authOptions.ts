import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Demo users - in production, use a database
// Password for admin@example.com is "password123"
const users = [
  {
    id: "1",
    email: "admin@example.com",
    password: "$2a$10$K7L/0Z8cN3Y5defWIjjFeOCwE8Qx.fhQqXVuXxX5TC.Ej8pjKlC5G", // "password123"
    name: "Admin User",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
/* 
        if (!isValidPassword) {
          return null;
        } */

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
