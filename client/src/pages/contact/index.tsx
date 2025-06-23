import React from "react";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import WajoLogo from "@/components/wajo-logo";

export default function ContactPage() {
  return (
    <PublicPage>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-8">
            <div className="space-y-8 lg:col-span-5">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Contact us</h1>
                <div className="h-1 w-32 bg-amber-400"></div>
              </div>

              <div className="space-y-3">
                <p className="text-lg text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  wajo-maths@uwa.edu.au
                </p>
              </div>

              <div className="space-y-4">
                <p className="leading-relaxed text-gray-600">
                  We have set up a WAJO participants list. You may subscribe for
                  your school by entering your details{" "}
                  <a
                    href="#"
                    className="font-semibold text-black underline transition-colors hover:text-amber-600"
                  >
                    here
                  </a>
                  . The WAJO participants list is a moderated list to eliminate
                  spamming. Its intended use is to disseminate announcements
                  directly to Heads of School Mathematics Departments (in
                  particular) or others who will be interested in or involved in
                  the organising of school teams for the WA Junior Maths
                  Olympiad. It is expected that email to this list will be
                  limited to the couple of months before each olympiad.
                </p>
              </div>

              <div className="pt-4">
                <Button className="flex transform items-center gap-3 rounded-full bg-amber-400 px-8 py-3 font-semibold text-black shadow-lg transition-all hover:bg-amber-500">
                  Contact us Form
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black"
                  >
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </div>

              <div className="space-y-6 border-t border-gray-200 pt-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    This website is maintained by the Western Australian
                    Mathematical Olympiads Committee (WAMOC):
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        <span className="underline">Dr Greg Gamble</span> (WA
                        State Director, AMOC)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        <span className="underline">
                          A/Prof. Alice Devillers
                        </span>{" "}
                        (Chair, Organising C'tee, UWA)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        <span className="underline">Prof. Cheryl Praeger</span>{" "}
                        (UWA)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        <span className="underline">Prof. Michael Giudici</span>{" "}
                        (UWA)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        Dr Miccal Matthews (UWA)
                      </a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        Dr Jamie Simpson (Curtin Univ.)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        Dr Elena Stoyanova (Education Consultant)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        Mr Mark White (Perth Modern School)
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      <a
                        href="#"
                        className="transition-colors hover:text-amber-600"
                      >
                        <span className="underline">Mrs Paula McMahon</span>{" "}
                        (MAWA Executive Officer)
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:col-span-3 lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl p-8">
                <WajoLogo className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicPage>
  );
}
