import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  apiKey: process.env.STACK_SECRET_SERVER_KEY,
  clientConfig: {
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
  },
  urls: {
    afterSignIn: "/profile",
    afterSignOut: "/"
  }
});