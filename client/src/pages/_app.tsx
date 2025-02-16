import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { Roboto, Urbanist } from "next/font/google";

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

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
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
          <Toaster closeButton position="bottom-center" richColors />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
