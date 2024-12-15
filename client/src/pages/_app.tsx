import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Roboto, Urbanist } from "next/font/google";
import type { ReactElement, ReactNode } from "react";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className={`${urbanist.variable} ${roboto.variable}`}>
        {getLayout(<Component {...pageProps} />)}
      </div>
    </QueryClientProvider>
  );
}
