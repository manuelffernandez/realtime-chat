import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter'
import { db } from '@/lib/db'

export const nextAuthOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    })
  ],
  pages: {
    signIn: '/signIn'
  },
  callbacks: {
    jwt: async (params) => {
      // console.log('JWT: ', params)
      const { token, user } = params
      const dbUser = await db.get<User>(`user:${token.id}`)

      if (!dbUser) {
        token.id = user.id
        return token
      }

      const { id, name, email, image } = dbUser

      return {
        id,
        name,
        email,
        image
      }
    },
    session: async (params) => {
      // console.log('SESSION: ', params)
      const { session, token } = params

      if (token) {
        const { id, email, name, image } = token
        session.user.id = id
        session.user.email = email as string
        session.user.name = name as string
        session.user.image = image
      }

      return session
    },
    redirect(params) {
      const { url, baseUrl } = params
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
}
