// Central export for all catalog data
export { manufacturers, productLines } from "./manufacturers";
export { profiles, getProfileByCode, getProfileById } from "./profiles";
export { typologies } from "./typologies";
export { cutRules } from "./cutRules";
export { glassRules, typologyComponents } from "./glassAndComponents";

import { typologies } from "./typologies";
import { cutRules } from "./cutRules";
import { glassRules, typologyComponents } from "./glassAndComponents";
import { profiles } from "./profiles";
import type { Typology, CutRule, GlassRule, TypologyComponent, Profile } from "@/types/calculation";

export function getTypologyById(id: string): Typology | undefined {
  return typologies.find(t => t.id === id);
}

export function getCutRulesForTypology(typologyId: string): CutRule[] {
  return cutRules.filter(r => r.typology_id === typologyId).sort((a, b) => a.sort_order - b.sort_order);
}

export function getGlassRulesForTypology(typologyId: string): GlassRule[] {
  return glassRules.filter(r => r.typology_id === typologyId);
}

export function getComponentsForTypology(typologyId: string): TypologyComponent[] {
  return typologyComponents.filter(c => c.typology_id === typologyId);
}

export function getTypologiesByLine(lineId: string): Typology[] {
  return typologies.filter(t => t.product_line_id === lineId && t.active);
}

export function getProfilesByLine(lineId: string): Profile[] {
  return profiles.filter(p => p.product_line_id === lineId && p.active);
}
