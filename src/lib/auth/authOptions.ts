/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
import dbConnect from "@/lib/mongoose";
import MsAccount from "@/models/MsAccount";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "feide",
      name: "Feide",
      type: "oauth",
      wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
      clientId: process.env.FEIDE_CLIENT_ID!,
      clientSecret: process.env.FEIDE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid profile email" } },
      idToken: true,
      checks: ["pkce", "state"],
      userinfo: { url: "https://auth.dataporten.no/userinfo" },
      profile(profile) {
        return {
          id: (profile as any).sub, // dette er bra
          name:
            (profile as any).name ??
            (profile as any).display_name ??
            [(profile as any).given_name, (profile as any).family_name]
              .filter(Boolean)
              .join(" ") ??
            null,
          email: (profile as any).email ?? null,
        };
      },
    },

    // AzureADProvider({
    //   id: "azure-ad",
    //   tenantId: process.env.AZURE_AD_TENANT_ID!,
    //   clientId: process.env.AZURE_AD_CLIENT_ID!,
    //   clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       scope: "openid profile email offline_access Calendars.Read",
    //       prompt: "consent",
    //     },
    //   },
    // }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Feide: sørg for en stabil id i token
      if (account?.provider === "feide") {
        // NextAuth sender ofte 'user' her som inneholder profile()-return
        const u = (user as any) ?? {};
        if (u?.id) (token as any).sub = u.id; // lagre Feide sub som token.sub
        if (u?.email) token.email = u.email;
        if (u?.name) token.name = u.name;

        // fallback hvis profile finnes
        const p = profile as any;
        if (!(token as any).sub && p?.sub) (token as any).sub = p.sub;
        if (!token.email && p?.email) token.email = p.email;
        if (!token.name && (p?.name || p?.display_name)) token.name = p.name ?? p.display_name;
      }

      // Azure: lagre tokens i DB + msConnected-flag
      if (account?.provider === "azure-ad") {
        const feideEmail = token.email as string | undefined;

        if (feideEmail && account.refresh_token && account.access_token && account.expires_at) {
          await dbConnect();
          await MsAccount.findOneAndUpdate(
            { feideEmail },
            {
              feideEmail,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
            },
            { upsert: true, new: true }
          );
          (token as any).msConnected = true;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // sette standardfeltene
      session.user = {
        ...session.user,
        email: (token.email as string | undefined) ?? session.user?.email,
        name: (token.name as string | undefined) ?? session.user?.name,
      };

      (session.user as any).id = ((token as any).sub as string | undefined) ?? session.user?.email ?? undefined;

      (session as any).msConnected = Boolean((token as any).msConnected);
      return session;
    },
  },

  debug: false,
};
