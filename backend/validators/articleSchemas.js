import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "title is required"),
  author: z.string().optional().nullable(),
  publishDate: z.union([z.string(), z.date()]).optional().nullable(),
  date: z.union([z.string(), z.date()]).optional().nullable(),
  content: z
    .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
    .optional(),
  summary: z
    .union([z.array(z.string()), z.string(), z.null(), z.undefined()])
    .optional(),
  imageUrl: z
    .union([z.string().url(), z.literal(""), z.null(), z.undefined()])
    .optional(),
  url: z.string().url("valid article url required"),
  site: z.string().min(1, "site is required"),
});

export const articleArraySchema = z.array(articleSchema).min(1, "At least one article required");
