import { z } from "zod";

export interface School {
  id: number;
  name: string;
  time_created: Date;
}

export const createSchoolSchema = z.object({
  name: z.string().min(1, "Required"),
});
