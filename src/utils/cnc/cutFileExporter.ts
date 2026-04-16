// CNC / Machine Integration for cut optimization
// Supports G-code, CSV, and machine-specific formats

import type { OptimizationResult } from "@/types/calculation";

export interface CutInstruction {
  piece_name: string;
  length_mm: number;
  quantity: number;
  profile_code: string;
  cut_angle?: number; // degrees
  notes?: string;
}

export interface CNCMachine {
  id: string;
  name: string;
  brand: string;
  model: string;
  interface: "gcode" | "csv" | "proprietary";
  description: string;
}

// Supported Machines
export const supportedMachines: CNCMachine[] = [
  {
    id: "generic-gcode",
    name: "Generic G-Code",
    brand: "Universal",
    model: "G-Code Standard",
    interface: "gcode",
    description: "Compatible with most CNC machines",
  },
  {
    id: "metabo-hpt",
    name: "Metabo HPT",
    brand: "Metabo HPT",
    model: "WVG-65",
    interface: "csv",
    description: "Metabo HPT multi-angle cutting machine",
  },
  {
    id: "bambach",
    name: "Bambach",
    brand: "Bambach",
    model: "Frame Mate",
    interface: "csv",
    description: "Bambach frame copying machine",
  },
  {
    id: "emmegi",
    name: "Emmegi",
    brand: "Emmegi",
    model: "Poly Line",
    interface: "gcode",
    description: "Emmegi angular cutting machines",
  },
  {
    id: "elaterm",
    name: "Elaterm",
    brand: "Elaterm",
    model: "SC-300",
    interface: "gcode",
    description: "Elaterm single and double head cutting machines",
  },
];

// Generate G-Code from optimization results
export function generateGCode(
  results: OptimizationResult[],
  machineId: string = "generic-gcode",
  options: {
    feedRate?: number;
    cutSpeed?: number;
    kerfWidth?: number;
    notes?: string;
  } = {}
): string {
  const { feedRate = 1000, cutSpeed = 3000, kerfWidth = 3, notes = "" } = options;

  let gcode = "; ============================================\n";
  gcode += "; AluFlow - CNC Cut File Export\n";
  gcode += "; Generated: " + new Date().toISOString() + "\n";
  gcode += "; Machine: " + machineId + "\n";
  if (notes) gcode += `; Notes: ${notes}\n`;
  gcode += "; ============================================\n\n";

  gcode += `G21 ; Metric mode (mm)\n`;
  gcode += `G90 ; Absolute positioning\n`;
  gcode += `F${feedRate} ; Feed rate\n`;
  gcode += `M03 S${cutSpeed} ; Spindle on\n\n`;

  let cutNumber = 1;
  for (const result of results) {
    gcode += `; ---- Bar ${result.barNumber} (Stock: ${result.stockLength}mm) ----\n`;
    gcode += `; Profile: ${result.profileCode}\n`;
    gcode += `; Pieces: ${result.pieces.length}\n`;
    gcode += `; Waste: ${result.wasteMm}mm (${result.wastePercent.toFixed(1)}%)\n\n`;

    for (const piece of result.pieces) {
      gcode += `; Cut #${cutNumber}: ${piece.label}\n`;
      gcode += `; Length: ${piece.length_mm}mm\n`;
      gcode += `G0 X0 Y0 ; Position\n`;
      gcode += `G1 X${piece.length_mm} ; Cut to length\n`;
      gcode += `G0 X${piece.length_mm + kerfWidth} ; Move to next position\n`;
      cutNumber++;
    }
    
    gcode += `\n; Remaining waste: ${result.wasteMm}mm\n`;
    gcode += `M05 ; Spindle off\n`;
    gcode += `M30 ; End of program\n\n`;
  }

  return gcode;
}

// Generate CSV for machines like Metabo HPT
export function generateMachineCSV(
  results: OptimizationResult[],
  machineId: string = "metabo-hpt"
): string {
  let csv = "Cut Number,Profile,Piece Name,Length (mm),Quantity,Angle,Notes\n";

  let cutNumber = 1;
  for (const result of results) {
    for (const piece of result.pieces) {
      csv += `${cutNumber},${result.profileCode},"${piece.label}",${piece.length_mm},1,90,\n`;
      cutNumber++;
    }
  }

  return csv;
}

// Generate Proprietary Format (example for Elaterm)
export function generateProprietaryFormat(
  results: OptimizationResult[],
  machineId: string
): string {
  let output = `*${machineId.toUpperCase()}\n`;
  output += `*JOB:${new Date().toISOString().split("T")[0]}\n`;
  output += `*UNIT:MM\n`;
  output += `*TYPE:CUT\n\n`;

  let cutNumber = 1;
  for (const result of results) {
    output += `@BAR:${result.barNumber}\n`;
    output += `@PROFILE:${result.profileCode}\n`;
    output += `@STOCK:${result.stockLength}\n`;
    output += `@WASTE:${result.wasteMm}\n\n`;

    for (const piece of result.pieces) {
      output += `${cutNumber}|${piece.length_mm}|90|${piece.label}\n`;
      cutNumber++;
    }
    output += `\n`;
  }

  return output;
}

// Main export function
export function exportCutFile(
  results: OptimizationResult[],
  machineId: string,
  format: "gcode" | "csv" | "proprietary",
  options?: {
    feedRate?: number;
    cutSpeed?: number;
    kerfWidth?: number;
    notes?: string;
  }
): { filename: string; content: string; mimeType: string } {
  let content: string;
  let filename: string;
  let mimeType: string;

  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  switch (format) {
    case "gcode":
      content = generateGCode(results, machineId, options);
      filename = `corte_${timestamp}.nc`;
      mimeType = "text/plain";
      break;
    case "csv":
      content = generateMachineCSV(results, machineId);
      filename = `corte_${timestamp}.csv`;
      mimeType = "text/csv";
      break;
    case "proprietary":
      content = generateProprietaryFormat(results, machineId);
      filename = `corte_${timestamp}.txt`;
      mimeType = "text/plain";
      break;
    default:
      content = generateGCode(results, machineId, options);
      filename = `corte_${timestamp}.nc`;
      mimeType = "text/plain";
  }

  return { filename, content, mimeType };
}

// Download helper
export function downloadCutFile(
  results: OptimizationResult[],
  machineId: string,
  format: "gcode" | "csv" | "proprietary",
  options?: {
    feedRate?: number;
    cutSpeed?: number;
    kerfWidth?: number;
    notes?: string;
  }
): void {
  const { filename, content, mimeType } = exportCutFile(results, machineId, format, options);
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
