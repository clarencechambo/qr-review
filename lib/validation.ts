import { z } from "zod";
import { DISCOVERY_OPTIONS } from "./types";

export function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

const discoveryChannelSchema = z.enum(
  DISCOVERY_OPTIONS as [string, ...string[]]
);

export const submitReviewSchema = z.object({
  phone_number: z
    .string()
    .min(7, "Phone number too short")
    .max(15, "Phone number too long")
    .transform(normalisePhone),
  discovery_channel: discoveryChannelSchema,
  discovery_other: z.string().optional(),
  price_rating: z.number().int().min(1).max(5),
  purchase_reason: z.string().min(1, "Please tell us what made you buy today"),
  staff_rating: z.number().int().min(1).max(5),
  staff_feedback: z.string().optional(),
});

export const submitReturnSchema = z.object({
  phone_number: z
    .string()
    .min(7)
    .max(15)
    .transform(normalisePhone),
  experience_note: z.string().min(1, "Please share your thoughts"),
});

export const checkPhoneSchema = z.object({
  phone: z
    .string()
    .min(7)
    .max(15)
    .transform(normalisePhone),
});
