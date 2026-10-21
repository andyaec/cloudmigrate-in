import type { ServiceSlug } from "./site";

export interface ServiceContent {
  headline: string;
  lede: string;
  sections: { h: string; p: string[] }[];
  deliverables: string[];
  approach: { phase: string; when?: string; detail: string }[];
  tooling: string[];
  targets?: { m: string; l: string }[];
  pitfalls?: string[];
  note?: string;
  artefacts: string[];
}

export type CloudContent = Partial<Record<ServiceSlug, ServiceContent>>;
