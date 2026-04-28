// Re-export from modular sub-components (backward compatibility)
// The actual implementation has been split into sub-directory modules

// Types
export type { SupplierProfile, CutRule, SupplierGlass, SupplierComponent } from './types';

// Profiles
export {
  goldProfiles,
  supremaProfiles,
  aluprimeProfiles,
  decaProfiles,
  tamizziProfiles,
  aluvidProfiles,
  glasterProfiles,
  allSupplierProfiles,
} from './profiles';

// Glasses
export { supplierGlasses } from './glasses';

// Components
export { supplierComponents } from './components';

// Standard cut rules
import type { CutRule } from './types';
export const standardCutRules: CutRule[] = [
  // Standard 90 degree cuts
  {
    profile_id: 'all',
    cut_type: 'straight',
    allowance_mm: 0,
    blade_thickness_mm: 3,
    description: 'Corte reto padrão',
  },
  // 45 degree cuts for frames
  {
    profile_id: 'all-main_frame',
    cut_type: '45deg',
    allowance_mm: 0,
    blade_thickness_mm: 3,
    description: 'Corte 45° para canto',
  },
  {
    profile_id: 'all-main_frame_60',
    cut_type: '45deg',
    allowance_mm: 0,
    blade_thickness_mm: 3,
    description: 'Corte 45° para canto',
  },
];

// Helper functions
import { allSupplierProfiles } from './profiles';
import { supplierGlasses } from './glasses';
import { supplierComponents } from './components';
import type { SupplierProfile, SupplierGlass, SupplierComponent } from './types';

export function getProfilesByLine(line: string): SupplierProfile[] {
  const lineLower = line.toLowerCase();
  return allSupplierProfiles.filter(
    p =>
      p.line.toLowerCase().includes(lineLower) || p.manufacturer.toLowerCase().includes(lineLower)
  );
}

export function getProfilesByType(type: string): SupplierProfile[] {
  return allSupplierProfiles.filter(p => p.profile_type === type);
}

export function getGlassesByThickness(thickness: number): SupplierGlass[] {
  return supplierGlasses.filter(g => g.thickness_mm === thickness);
}

export function getGlassesByType(type: string): SupplierGlass[] {
  return supplierGlasses.filter(g => g.type === type);
}

export function getComponentsByType(type: string): SupplierComponent[] {
  return supplierComponents.filter(c => c.type === type);
}

export function getComponentPrice(id: string): number {
  const comp = supplierComponents.find(c => c.id === id);
  return comp?.price || 0;
}

export function getAllManufacturers(): string[] {
  const manufacturers = new Set(allSupplierProfiles.map(p => p.manufacturer));
  return Array.from(manufacturers).sort();
}

export function getAllLines(): { manufacturer: string; line: string }[] {
  const lines = new Map<string, { manufacturer: string; line: string }>();
  allSupplierProfiles.forEach(p => {
    const key = `${p.manufacturer}-${p.line}`;
    if (!lines.has(key)) {
      lines.set(key, { manufacturer: p.manufacturer, line: p.line });
    }
  });
  return Array.from(lines.values()).sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
}
