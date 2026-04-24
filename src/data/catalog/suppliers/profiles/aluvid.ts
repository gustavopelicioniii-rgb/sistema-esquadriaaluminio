// ===== ALUVID (Vidual) =====
import type { SupplierProfile } from "../types";
export const aluvidProfiles: SupplierProfile[] = [
  {
    id: "alv-mf-42",
    name: "Aluvid Main Frame 42mm",
    manufacturer: "Aluvid (Vidual)",
    line: "Aluvid",
    profile_type: "main_frame",
    code: "ALV-MF-42",
    description: "Batente 42mm Aluvid",
    weight_kg_m: 0.70,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "grafite"],
    available: true,
    thickness_mm: 1.4,
    width_mm: 42,
    height_mm: 42,
    inertia_x: 4.5,
    inertia_y: 4.0,
  },
  {
    id: "alv-guid-28",
    name: "Aluvid Guideline 28mm",
    manufacturer: "Aluvid (Vidual)",
    line: "Aluvid",
    profile_type: "guideline",
    code: "ALV-GUID-28",
    description: "Guideline 28mm Aluvid",
    weight_kg_m: 0.50,
    standard_mm: 6000,
    color_finishes: ["natural", "branco", "bronze", "grafite"],
    available: true,
    thickness_mm: 1.3,
    width_mm: 28,
    height_mm: 38,
  },
];

