import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/db"

export const authOptions: NextAuthOptions = {
  // Eliminamos el PrismaAdapter para que no busque tablas inexistentes
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt", // NextAuth guardará de forma segura la sesión en una cookie cifrada
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        // Aquí puedes buscar el arquetipo en la base de datos usando el email si lo necesitas:
        // const arquetipo = await prisma.arquetipo.findUnique({ where: { email: session.user.email } })
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
