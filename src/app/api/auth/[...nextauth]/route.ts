import { nextAuthOptions } from '@/lib/constants/auth.const'
import NextAuth from 'next-auth'

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
