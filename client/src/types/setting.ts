export enum SettingKey {
  CONTACT_US_PAGE = "contact_us",
  LANDING_PAGE = "landing",
  PAYMENT_DETAILS = "payment",
}

export interface Setting {
  id: number;
  key: SettingKey;
  value: any;
}

export interface ContactUsSetting extends Setting {
  value: {
    main: string;
    committee: string;
  };
}

export interface LandingSetting extends Setting {
  value: {
    title: string;
    comp_details: string;
    ques_details: string;
  };
}

export interface PaymentSetting extends Setting {
  value: {
    email: string;
    fee: string;
  };
}
