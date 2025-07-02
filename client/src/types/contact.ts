import z from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  school: z.string().min(1, "School is required"),
  subject: z.string().min(1, "Subject is required"),
  enquiry: z
    .string()
    .min(10, "Please provide more details (minimum 10 characters)"),
  recaptcha: z.string().min(1, "Please complete the reCAPTCHA verification"),
});
