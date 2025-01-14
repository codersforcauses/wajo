import { z } from "zod";

export interface Team {
  id: number;
  name: string;
  school: string;
  description: string;
  time_created: Date;
}

export const createTeamSchema = z.object({
  name: z.string().min(1, "Required"),
  school_id: z.number({ message: "Required" }),
  description: z.string().min(1, "Required"),
});
