export type DiscoveryChannel =
  | "Social Media"
  | "Word of Mouth"
  | "Walk-by / Signage"
  | "Online Search"
  | "Advertisement"
  | "Other";

export const DISCOVERY_OPTIONS: DiscoveryChannel[] = [
  "Social Media",
  "Word of Mouth",
  "Walk-by / Signage",
  "Online Search",
  "Advertisement",
  "Other",
];

export interface Review {
  id: string;
  name?: string | null;
  phone_number: string;
  discovery_channel: DiscoveryChannel;
  discovery_other?: string | null;
  price_rating: number;
  purchase_reason: string;
  staff_rating: number;
  staff_feedback?: string | null;
  created_at: string;
}

export interface ReturnVisit {
  id: string;
  phone_number: string;
  original_review: string;
  experience_note: string;
  created_at: string;
}

export type FormStep =
  | "phone"
  | "discovery"
  | "price"
  | "purchase"
  | "staff"
  | "done";

export interface ReviewFormState {
  name: string;
  phone: string;
  discovery_channel: DiscoveryChannel | "";
  discovery_other: string;
  price_rating: number | null;
  purchase_reason: string;
  staff_rating: number | null;
  staff_feedback: string;
}
