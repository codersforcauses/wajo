import Image from "next/image";
import { Drawer } from "vaul";

import logo from "../../../public/wajo_white.svg";

export default function MobileNav() {
  return (
    <Drawer.Root direction="top">
      <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]">
        Open Drawer
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
          <div className="flex h-full w-full grow flex-col bg-zinc-50 p-5">
            <div className="mx-auto max-w-md">
              <Drawer.Title className="font- mb-2 flex justify-between text-base text-zinc-900">
                <Image
                  src={logo}
                  alt="WAJO logo with white background"
                  width={105}
                  height={105}
                />
                <Drawer.Close>X</Drawer.Close>
              </Drawer.Title>
              <Drawer.Description className="mb-2 text-zinc-600">
                This one specifically is not touching the edge of the screen,
                but that&apos;s not required for a side drawer.
              </Drawer.Description>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}