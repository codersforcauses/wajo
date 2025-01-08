import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Roboto, Urbanist } from "next/font/google";
import type { ReactElement, ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-provider";

const fontUrbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const fontRoboto = Roboto({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto",
});

/**
 * Type definition for page with layout
 *
 * @see https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript
 */
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-urbanist: ${fontUrbanist.style.fontFamily};
          --font-roboto: ${fontRoboto.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...pageProps} />
          {/* temporary include here, can add into Layout after */}
          <Toaster position="bottom-center" richColors />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
