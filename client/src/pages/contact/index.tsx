import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import z from "zod";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditableSection from "@/components/ui/editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WaitingLoader } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import WajoLogo from "@/components/wajo-logo";
import { useFetchData } from "@/hooks/use-fetch-data";
import { contactFormSchema } from "@/types/contact";
import { ContactUsSetting, SettingKey } from "@/types/setting";

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const userRole = Cookies.get("user_role");

  const { data, isLoading, isError, error } = useFetchData<ContactUsSetting>({
    queryKey: [`setting.config.${SettingKey.CONTACT_US_PAGE}`],
    endpoint: `/setting/config/?key=${SettingKey.CONTACT_US_PAGE}`,
  });

  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else
    return (
      <PublicPage>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-20 py-10">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-8">
              <div className="space-y-8 lg:col-span-5">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-gray-900">
                    Contact us
                  </h1>
                  <div className="h-1 w-32 bg-amber-400"></div>
                  <EditableSection
                    canEdit={userRole === "admin"}
                    setting={data}
                    sectionKey="main"
                    initialContent={data.value?.main || "[Add Text here]"}
                  />
                  {/* <div className="space-y-3">
                    <p className="text-lg text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      wajo-maths@uwa.edu.au
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="leading-relaxed text-gray-600">
                      We have set up a WAJO participants list. You may subscribe
                      for your school by entering your details{" "}
                      <a
                        href="#"
                        className="font-semibold text-black underline transition-colors hover:text-amber-600"
                      >
                        here
                      </a>
                      . The WAJO participants list is a moderated list to
                      eliminate spamming. Its intended use is to disseminate
                      announcements directly to Heads of School Mathematics
                      Departments (in particular) or others who will be
                      interested in or involved in the organising of school
                      teams for the WA Junior Maths Olympiad. It is expected
                      that email to this list will be limited to the couple of
                      months before each olympiad.
                    </p>
                  </div> */}
                </div>
                <div className="pt-4">
                  <DialogForm />
                </div>

                <div className="space-y-6 border-t border-gray-200 pt-8">
                  <EditableSection
                    canEdit={userRole === "admin"}
                    setting={data}
                    sectionKey={"committee"}
                    initialContent={data.value?.committee || "[Add Text here]"}
                  />
                  {/* <div className="space-y-3">
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
                          <span className="underline">
                            Prof. Cheryl Praeger
                          </span>{" "}
                          (UWA)
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <a
                          href="#"
                          className="transition-colors hover:text-amber-600"
                        >
                          <span className="underline">
                            Prof. Michael Giudici
                          </span>{" "}
                          (UWA)
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <a
                          href="#"
                          className="transition-colors hover:text-amber-600"
                        >
                          <span className="underline">Dr Miccal Matthews</span>{" "}
                          (UWA)
                        </a>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <a
                          href="#"
                          className="transition-colors hover:text-amber-600"
                        >
                          <span className="underline">Dr Jamie Simpson</span>{" "}
                          (Curtin Univ.)
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <a
                          href="#"
                          className="transition-colors hover:text-amber-600"
                        >
                          <span className="underline">Dr Elena Stoyanova</span>{" "}
                          (Education Consultant)
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <a
                          href="#"
                          className="transition-colors hover:text-amber-600"
                        >
                          <span className="underline">Mr Mark White</span>{" "}
                          (Perth Modern School)
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <a
                          href="#"
                          className="transition-colors hover:text-amber-600"
                        >
                          <span className="underline">Mrs Paula McMahon</span>{" "}
                          (MAWA)
                        </a>
                      </p>
                    </div>
                  </div> */}
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

function DialogForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      school: "",
      subject: "",
      enquiry: "",
      recaptcha: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Reset reCAPTCHA after submission
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    form.setValue("recaptcha", "");

    alert(JSON.stringify(data, null, 2));
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      form.setValue("recaptcha", token);
      form.clearErrors("recaptcha");
    } else {
      form.setValue("recaptcha", "");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="text-xl font-bold">Contact us</div>
            <div className="h-[3px] w-16 bg-amber-400"></div>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact number</FormLabel>
                    <FormControl>
                      <Input placeholder="0412345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input placeholder="School Name" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    *If your school is registered with us, you can search for it
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enquiry subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enquiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enquiry</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your enquiry here"
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recaptcha"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={
                          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                          "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        }
                        onChange={handleRecaptchaChange}
                        onExpired={() => handleRecaptchaChange(null)}
                        onError={() => handleRecaptchaChange(null)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-amber-400 font-semibold text-black hover:bg-amber-500"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
