import GithubProvider from 'next-auth/providers/github'
import LineProvider from 'next-auth/providers/line'
import type { NextAuthOptions } from 'next-auth'

const options: NextAuthOptions = {
  providers: [
    GithubProvider.default({
      // clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      // clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
      clientId: '381722ffda6d5d24f6b5',
      clientSecret: 'f299271f4191972ee2f15dbef06071f5e4fb7da4',
    }),
    // LineProvider.default({
    //   clientId: '1657378767',
    //   clientSecret: '758311efbf38235a720642a15d9970e6',
    // }),
  ],
}

export default options
