import { z } from "zod";

export enum SettingKey {
  INVOICE_DETAILS = "invoice",
}

export interface Setting {
  id: number;
  key: SettingKey;
  value: any;
}

export interface PaymentSetting extends Setting {
  value: PaymentSettings;
}

export interface PaymentSettings {
  address: string;
  email: string;
  website: string;
  fees: number;
  accountName: string;
  bsb: string;
  accountNumber: string;
  chairTitle: string;
  chairName: string;
  signature: string;
}

export const paymentSettingsSchema = z.object({
  address: z.string().min(1, "Required"),
  email: z.string().email(),
  website: z.string().url(),
  fees: z.number().min(1),
  accountName: z.string().min(1, "Required"),
  bsb: z.string().min(1, "Required"),
  accountNumber: z.string().min(1, "Required"),
  chairName: z.string().min(1, "Required"),
  chairTitle: z.string().min(1, "Required"),
  signature: z.string().min(1, "Required"),
});
