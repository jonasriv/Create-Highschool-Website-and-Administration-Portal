import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "feide",
      name: "Feide",
      type: "oauth",
      wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
      clientId: process.env.FEIDE_CLIENT_ID!,
      clientSecret: process.env.FEIDE_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
      idToken: true,
      checks: ["pkce", "state"],

      // Hent brukerinfo (der "Navn" / "E-post" osv kommer)
      userinfo: {
        url: "https://auth.dataporten.no/userinfo",
      },

      profile(profile) {
        // (valgfritt) logg for å se hva du faktisk får
        // console.log("FEIDE USERINFO:", profile);

        return {
          id: profile.sub,
          name:
            profile.name ??
            profile.display_name ??
            [profile.given_name, profile.family_name].filter(Boolean).join(" ") ??
            null,
          email: profile.email ?? null,
        };
      },
    },
  ],
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
