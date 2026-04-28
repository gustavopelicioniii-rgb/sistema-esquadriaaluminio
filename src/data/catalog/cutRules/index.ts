// Re-export all cut rules from sub-modules
export { supremaCutRules } from './suprema';
export { goldCutRules } from './gold';
export { topCutRules } from './top';
export { decampL45CutRules } from './decampL45';

import { supremaCutRules } from './suprema';
import { goldCutRules } from './gold';
import { topCutRules } from './top';
import { decampL45CutRules } from './decampL45';
import { pratic20CutRules, pratic32CutRules } from '../cutRulesPratic';
import { perfettaCutRules } from '../cutRulesPerfetta';
import type { CutRule } from '@/types/calculation';

// Combined cut rules from all lines
export const cutRules: CutRule[] = [
  ...supremaCutRules,
  ...goldCutRules,
  ...topCutRules,
  ...decampL45CutRules,
  ...pratic20CutRules,
  ...pratic32CutRules,
  ...perfettaCutRules,
];
