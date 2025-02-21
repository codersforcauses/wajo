import { AlignJustify, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Drawer } from "vaul";

import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/ui/Users/login-modal";

export default function MobileNav() {
  return (
    <Drawer.Root direction="top">
      <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]">
        <AlignJustify />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />{" "}
        {/* Darkens the background */}
        <Drawer.Content
          className="fixed top-0 z-10 flex w-full outline-none"
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full grow flex-col border border-red-500 bg-zinc-50 p-5">
            {/* <div className="mx-auto"> */}
            <Drawer.Title className="mx-5 flex justify-between border border-green-500 text-base text-zinc-900">
              <Image
                src="wajo_white.svg"
                alt="WAJO logo with white background"
                width={105}
                height={105}
              />
              <Drawer.Close>
                <X />
              </Drawer.Close>
            </Drawer.Title>
            <Drawer.Description className="mb-2 flex flex-col items-center justify-center gap-4 text-zinc-600">
              <Link href="/news">News</Link>
              <Link href="/awards">Awards</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/contact">Contact us</Link>
              <LoginModal>
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="border-2 border-black font-roboto text-lg"
                >
                  Login
                </Button>
              </LoginModal>
            </Drawer.Description>
            {/* </div> */}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
