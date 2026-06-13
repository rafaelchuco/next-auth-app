import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/signIn",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
