import { zodResolver } from "@hookform/resolvers/zod";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProtectedPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WaitingLoader } from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";
import { useDownloadInvoiceDocx, useFetchData } from "@/hooks/use-fetch-data";
import { useDynamicPatchMutation } from "@/hooks/use-put-data";
import {
  PaymentSetting,
  paymentSettingsSchema,
  SettingKey,
} from "@/types/settings";
import { Role } from "@/types/user";

export default function PageConfig() {
  const roles = [Role.ADMIN];
  return (
    <ProtectedPage requiredRoles={roles}>
      <InvoiceSettingsPage />
    </ProtectedPage>
  );
}

type FormValues = z.infer<typeof paymentSettingsSchema>;

function InvoiceSettingsPage() {
  const { data, isLoading, isError, error } = useFetchData<PaymentSetting>({
    queryKey: [`setting.config.${SettingKey.INVOICE_DETAILS}`],
    endpoint: `/setting/config/?key=${SettingKey.INVOICE_DETAILS}`,
  });
  if (isLoading || !data) return <WaitingLoader />;
  else if (isError) return <div>Error: {error?.message}</div>;
  else
    return <SettingsForm setting={data || ({ value: {} } as PaymentSetting)} />;
}

function SettingsForm({ setting }: { setting: PaymentSetting }) {
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);

  const invoiceVal = setting.value;
  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      address: invoiceVal.address || "",
      email: invoiceVal.email || "",
      website: invoiceVal.website || "",
      fees: invoiceVal.fees || 0,
      accountName: invoiceVal.accountName || "",
      bsb: invoiceVal.bsb || "",
      accountNumber: invoiceVal.accountNumber || "",
      chairTitle: invoiceVal.chairTitle || "",
      chairName: invoiceVal.chairName || "",
      signature: invoiceVal.signature || "",
    },
  });

  const mutationKey = ["setting.config", `${setting.id}`];
  const { mutate: saveSettings, isPending } = useDynamicPatchMutation({
    baseUrl: "/setting/config",
    queryKeys: [mutationKey],
    mutationKey: mutationKey,
    onSuccess: () => {
      toast.success("Saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const onSignatureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSignatureBase64(base64);
      form.setValue("signature", base64);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (invoiceVal.signature) {
      setSignatureBase64(invoiceVal.signature);
    }
  }, [invoiceVal.signature]);

  const onSubmit = (value: FormValues) => {
    saveSettings({
      id: setting.id,
      data: { value },
    });
  };

  const downloadInvoice = useDownloadInvoiceDocx({
    onSuccess: () => {
      toast.success("Sample invoice download successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error;
      toast.error(errorMessage || "Failed to download sample invoice");
    },
  });

  const handleDownload = () => {
    downloadInvoice.mutate({ timeout: 1000 });
  };

  return (
    <div className="mx-auto my-4 max-w-3xl rounded-lg bg-gray-50 p-4 shadow-lg">
      <div className="grid grid-cols-3">
        <div className="col-span-1"></div>
        <div className="col-span-1 my-auto">
          <h1 className="text-center text-xl font-bold">
            Invoice Details Setting
          </h1>
        </div>
        <div className="col-span-1 text-end">
          <Button
            type="button"
            onClick={handleDownload}
            variant={"ghost"}
            disabled={downloadInvoice.isPending}
            className="rounded-lg border-green-700 p-2 text-2xl font-black text-green-700 outline-double"
          >
            <Download className="me-1" size={30} />
            {downloadInvoice.isPending ? "Generating" : "Sample"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Address */}
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department & Company Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Department of Math\n123 Main Street\nSuburb WA 6000`}
                    rows={4} // to adjust height
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="md:col-span-3">
              {/* Website */}
              <FormField
                name="website"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        {...field}
                        placeholder="https://example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="example@email.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-1">
              {/* Fees */}
              <FormField
                name="fees"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fees (AUD)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Please input fees amount"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Account Name */} {/* 2 columns */}
            <div className="md:col-span-2">
              <FormField
                name="accountName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Company Account Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* BSB */} {/* 1 columns */}
            <div className="md:col-span-1">
              <FormField
                name="bsb"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BSB</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="000-000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Account Number */} {/* 1 columns */}
            <div className="md:col-span-1">
              <FormField
                name="accountNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="12345678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
              {/* Chair Name */} {/* 1 columns */}
              <FormField
                name="chairName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chair Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-1">
              {/* Chair Title */} {/* 1 columns */}
              <FormField
                name="chairTitle"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Chair" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Signature */}
          <div className="flex min-h-[325px] flex-1 flex-col gap-3 rounded-lg border-2 border-[#7D916F] p-5">
            <FormField
              name="signature"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="imageInput"
                    className="flex items-center gap-2 text-lg"
                  >
                    Upload Signature Image <ImageIcon />
                  </FormLabel>
                  <FormControl>
                    <Input id="signature" className="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input
              id="signatureInput"
              type="file"
              onChange={onSignatureChange}
              className="block w-full text-sm text-slate-500 file:ml-0 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary hover:cursor-pointer hover:file:bg-violet-100"
              accept="image/jpeg, image/png, image/jpg"
            />

            <div className="flex flex-1 items-center justify-center">
              {signatureBase64 && (
                <Image
                  src={signatureBase64}
                  alt="Signature Image"
                  width="0"
                  height="0"
                  className="h-auto w-auto"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
