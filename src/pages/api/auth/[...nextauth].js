import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: "279388001610-3b0d7ncjdlndvpe72kovec19s8qtohto.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  pages: {
    signIn: '/resume/resumeLanding', // Optional: Customize sign-in page
    error: '/auth/error', 
    signOut: '/resume/resumeLanding'  // Optional: Customize error page
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the Google access token to the JWT
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the Google access token to the session
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to a specific page after login (e.g., dashboard)
      if (url === baseUrl) {
        return baseUrl + "/resume/resumedashboard"; // Default redirect (can be any page)
      }
      return url; // Return the URL if it's not the base URL
    },
  },
});
