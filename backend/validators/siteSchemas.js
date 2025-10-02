import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1, "site name is required"),
  url: z.string().url("valid site url required"),
  image: z.string().url().optional().nullable(),
});

export const siteArraySchema = z.array(siteSchema).min(1, "At least one site required");
