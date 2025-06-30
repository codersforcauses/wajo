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
  department: string;
  chairTitle: string;
  chairName: string;
  signature: string;
}

export const paymentSettingsSchema = z.object({
  address: z.string().min(1),
  email: z.string().email(),
  website: z.string().url(),
  fees: z.number().min(1),
  accountName: z.string().min(1),
  bsb: z.string().min(1),
  accountNumber: z.string().min(1),
  department: z.string().min(1),
  chairName: z.string().min(1),
  chairTitle: z.string().min(1),
  signature: z.string().min(1, "Signature is required"),
});
