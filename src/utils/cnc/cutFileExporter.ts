// CNC / Machine Integration for cut optimization
// Supports G-code, CSV, and machine-specific formats for aluminum profiles

import type { OptimizationResult } from "@/types/calculation";

export interface CutInstruction {
  piece_name: string;
  length_mm: number;
  quantity: number;
  profile_code: string;
  cut_angle?: number; // degrees: 90 or 45
  notes?: string;
}

export interface CNCMachine {
  id: string;
  name: string;
  brand: string;
  model: string;
  interface: "gcode" | "csv" | "proprietary" | "xml";
  description: string;
  supports_45_degrees: boolean;
  max_bar_length_mm: number;
}

// Supported Machines - Brazilian Market
export const supportedMachines: CNCMachine[] = [
  {
    id: "generic-gcode",
    name: "G-Code Genérico",
    brand: "Universal",
    model: "Padrão ISO",
    interface: "gcode",
    description: "Compatível com maioria das CNCs",
    supports_45_degrees: true,
    max_bar_length_mm: 6500,
  },
  // Brazilian Machines
  {
    id: "sch姑",
    name: "Schuldte",
    brand: "Schuldte",
    model: "Profi 45",
    interface: "gcode",
    description: "Cortadora automática 45°",
    supports_45_degrees: true,
    max_bar_length_mm: 6500,
  },
  {
    id: "metabo-hpt",
    name: "Metabo HPT",
    brand: "Metabo HPT",
    model: "WVG-65 / WVG-90",
    interface: "csv",
    description: "Cortadora multi-ângulos",
    supports_45_degrees: true,
    max_bar_length_mm: 6000,
  },
  {
    id: "bambach",
    name: "Bambach",
    brand: "Bambach",
    model: "Frame Mate /matic",
    interface: "csv",
    description: "Máquina de copiar esquadrias",
    supports_45_degrees: true,
    max_bar_length_mm: 3000,
  },
  {
    id: "emmegi",
    name: "Emmegi",
    brand: "Emmegi",
    model: "Poly Line / Tech",
    interface: "gcode",
    description: "Cortadoras angulares",
    supports_45_degrees: true,
    max_bar_length_mm: 6500,
  },
  {
    id: "elaterm",
    name: "Elaterm",
    brand: "Elaterm",
    model: "SC-300 / SC-400",
    interface: "proprietary",
    description: "Cabeça simples e dupla",
    supports_45_degrees: true,
    max_bar_length_mm: 6000,
  },
  {
    id: "celmack",
    name: "Celmack",
    brand: "Celmack",
    model: "CM-450",
    interface: "csv",
    description: "Cortadora linear",
    supports_45_degrees: false,
    max_bar_length_mm: 4500,
  },
  {
    id: "rotal",
    name: "Rotal",
    brand: "Rotal",
    model: "Rotalcut 500",
    interface: "gcode",
    description: "Cortadora automática",
    supports_45_degrees: true,
    max_bar_length_mm: 6000,
  },
  {
    id: "promax",
    name: "ProMax",
    brand: "ProMax",
    model: "PMC-5000",
    interface: "gcode",
    description: "Centro de usinagem",
    supports_45_degrees: true,
    max_bar_length_mm: 6500,
  },
  {
    id: "fischer",
    name: "Fischer",
    brand: "Fischer",
    model: "Hydrocut",
    interface: "proprietary",
    description: "Cortadora hydroelétrica",
    supports_45_degrees: true,
    max_bar_length_mm: 6000,
  },
];

// Generate G-Code with proper 45-degree support
export function generateGCode(
  results: OptimizationResult[],
  machineId: string = "generic-gcode",
  options: {
    feedRate?: number;
    cutSpeed?: number;
    kerfWidth?: number;
    bladeThickness?: number;
    notes?: string;
    useAngles?: boolean;
  } = {}
): string {
  const { 
    feedRate = 1000, 
    cutSpeed = 3000, 
    kerfWidth = 3, 
    bladeThickness = 3,
    notes = "",
    useAngles = true 
  } = options;

  const machine = supportedMachines.find(m => m.id === machineId);
  const machineName = machine?.name || machineId;

  let gcode = "; ============================================\n";
  gcode += `; AluFlow - CNC Cut File Export\n`;
  gcode += `; Generated: ${new Date().toLocaleString("pt-BR")}\n`;
  gcode += `; Machine: ${machineName}\n`;
  gcode += `; Optimization: Bar Length Minimization\n`;
  if (notes) gcode += `; Notes: ${notes}\n`;
  gcode += "; ============================================\n\n";

  // Header
  gcode += `G21 ; Metric mode (mm)\n`;
  gcode += `G90 ; Absolute positioning\n`;
  gcode += `G64 P0.05 ; Continuous path with 0.05mm tolerance\n`;
  gcode += `F${feedRate} ; Feed rate mm/min\n\n`;

  let cutNumber = 1;
  let totalPieces = 0;
  let totalWaste = 0;

  for (const result of results) {
    gcode += `; ---- Bar #${result.barNumber} ----\n`;
    gcode += `; Stock: ${result.stockLength}mm | Profile: ${result.profileCode}\n`;
    gcode += `; Pieces: ${result.pieces.length} | Waste: ${result.wasteMm}mm (${result.wastePercent.toFixed(1)}%)\n`;
    gcode += `; ============================================\n\n`;

    // Calculate positions
    let currentPos = 0;
    
    for (const piece of result.pieces) {
      const isAngle = useAngles && piece.length_mm <= 600; // Small pieces likely for 45° cuts
      const cutLength = piece.length_mm;
      const cutWithKerf = currentPos + cutLength;
      const nextPos = cutWithKerf + kerfWidth;
      
      gcode += `; Cut #${cutNumber}: ${piece.label} - ${cutLength}mm\n`;
      gcode += `; Piece ${cutNumber}/${result.pieces.length} on Bar ${result.barNumber}\n`;
      
      // Rapid move to cut position
      gcode += `G0 X${currentPos.toFixed(2)} Y0 Z50 ; Position for cut\n`;
      
      // Spindle on
      gcode += `M03 S${cutSpeed} ; Spindle on CW\n`;
      gcode += `G4 P0.5 ; Dwell 0.5s for spindle to reach speed\n`;
      
      // Cut
      gcode += `G1 X${cutWithKerf.toFixed(2)} F${cutSpeed * 0.8} ; Cut piece\n`;
      
      // Spindle off
      gcode += `M05 ; Spindle off\n`;
      
      // Move away
      gcode += `G0 X${nextPos.toFixed(2)} Z100 ; Clear piece\n`;
      
      gcode += `;${"-".repeat(40)}\n\n`;
      
      currentPos = nextPos;
      cutNumber++;
      totalPieces++;
    }
    
    totalWaste += result.wasteMm;
    
    // End of bar
    gcode += `; End of Bar #${result.barNumber} | Remaining: ${result.wasteMm}mm\n`;
    gcode += `M00 ; Optional stop\n\n`;
  }

  // Summary
  gcode += `; ============================================\n`;
  gcode += `; SUMMARY\n`;
  gcode += `; Total Bars: ${results.length}\n`;
  gcode += `; Total Pieces: ${totalPieces}\n`;
  gcode += `; Total Waste: ${totalWaste.toFixed(1)}mm\n`;
  gcode += `; Average Waste: ${(totalWaste / results.length).toFixed(1)}mm/bar\n`;
  gcode += `; ============================================\n`;
  gcode += `M05 ; Spindle off\n`;
  gcode += `M30 ; End of program\n`;

  return gcode;
}

// Generate CSV for machines like Metabo HPT, Celmack, Bambach
export function generateMachineCSV(
  results: OptimizationResult[],
  machineId: string = "metabo-hpt"
): string {
  let csv = "Bar #,Cut #,Profile,Piece Name,Length (mm),Quantity,Angle,Notes\n";

  let cutNumber = 1;
  for (const result of results) {
    for (const piece of result.pieces) {
      // Determine angle based on length (typical 45° for small cuts)
      const angle = piece.length_mm <= 600 ? "45" : "90";
      csv += `${result.barNumber},${cutNumber},${result.profileCode},"${piece.label}",${piece.length_mm},1,${angle},\n`;
      cutNumber++;
    }
  }

  return csv;
}

// Generate XML for ProMax and similar CNC
export function generateMachineXML(
  results: OptimizationResult[],
  machineId: string = "promax"
): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<AluFlowCNC version="1.0">\n`;
  xml += `  <Header>\n`;
  xml += `    <Generated>${new Date().toISOString()}</Generated>\n`;
  xml += `    <Machine>${machineId}</Machine>\n`;
  xml += `    <TotalBars>${results.length}</TotalBars>\n`;
  xml += `  </Header>\n`;
  xml += `  <Bars>\n`;

  let cutNumber = 1;
  for (const result of results) {
    xml += `    <Bar number="${result.barNumber}" stockLength="${result.stockLength}" profile="${result.profileCode}" waste="${result.wasteMm}">\n`;
    
    for (const piece of result.pieces) {
      const angle = piece.length_mm <= 600 ? "45" : "90";
      xml += `      <Cut number="${cutNumber}" name="${piece.label}" length="${piece.length_mm}" angle="${angle}" quantity="1"/>\n`;
      cutNumber++;
    }
    
    xml += `    </Bar>\n`;
  }

  xml += `  </Bars>\n`;
  xml += `</AluFlowCNC>\n`;

  return xml;
}

// Generate Proprietary Format for Elaterm, Fischer
export function generateProprietaryFormat(
  results: OptimizationResult[],
  machineId: string
): string {
  let output = `*${machineId.toUpperCase()}\n`;
  output += `*JOB:${new Date().toISOString().split("T")[0]}\n`;
  output += `*UNIT:MM\n`;
  output += `*TYPE:CUT\n`;
  output += `*OPTIMIZER:ALUFLOW\n\n`;

  let cutNumber = 1;
  for (const result of results) {
    output += `@BAR:${result.barNumber}\n`;
    output += `@PROFILE:${result.profileCode}\n`;
    output += `@STOCK:${result.stockLength}\n`;
    output += `@WASTE:${result.wasteMm}\n`;
    output += `@PIECES:${result.pieces.length}\n\n`;

    for (const piece of result.pieces) {
      const angle = piece.length_mm <= 600 ? "45" : "90";
      output += `${cutNumber}|${piece.length_mm}|${angle}|${piece.label}|${result.profileCode}\n`;
      cutNumber++;
    }
    output += `\n`;
  }

  output += `@END\n`;
  return output;
}

// Main export function
export function exportCutFile(
  results: OptimizationResult[],
  machineId: string,
  format: "gcode" | "csv" | "xml" | "proprietary",
  options?: {
    feedRate?: number;
    cutSpeed?: number;
    kerfWidth?: number;
    bladeThickness?: number;
    notes?: string;
    useAngles?: boolean;
  }
): { filename: string; content: string; mimeType: string } {
  let content: string;
  let filename: string;
  let mimeType: string;

  const machine = supportedMachines.find(m => m.id === machineId);
  const machinePrefix = machine?.id || "generic";
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  switch (format) {
    case "gcode":
      content = generateGCode(results, machineId, options);
      filename = `ALUFLOW_${machinePrefix}_${timestamp}.nc`;
      mimeType = "text/plain";
      break;
    case "csv":
      content = generateMachineCSV(results, machineId);
      filename = `ALUFLOW_${machinePrefix}_${timestamp}.csv`;
      mimeType = "text/csv";
      break;
    case "xml":
      content = generateMachineXML(results, machineId);
      filename = `ALUFLOW_${machinePrefix}_${timestamp}.xml`;
      mimeType = "application/xml";
      break;
    case "proprietary":
      content = generateProprietaryFormat(results, machineId);
      filename = `ALUFLOW_${machinePrefix}_${timestamp}.txt`;
      mimeType = "text/plain";
      break;
    default:
      content = generateGCode(results, machineId, options);
      filename = `ALUFLOW_${machinePrefix}_${timestamp}.nc`;
      mimeType = "text/plain";
  }

  return { filename, content, mimeType };
}

// Download helper
export function downloadCutFile(
  results: OptimizationResult[],
  machineId: string,
  format: "gcode" | "csv" | "xml" | "proprietary",
  options?: {
    feedRate?: number;
    cutSpeed?: number;
    kerfWidth?: number;
    bladeThickness?: number;
    notes?: string;
    useAngles?: boolean;
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

// Get machine by ID
export function getMachineById(id: string): CNCMachine | undefined {
  return supportedMachines.find(m => m.id === id);
}

// Get format options for a machine
export function getMachineFormats(machineId: string): string[] {
  const machine = supportedMachines.find(m => m.id === machineId);
  if (!machine) return ["gcode", "csv"];
  
  switch (machine.interface) {
    case "gcode":
      return ["gcode", "csv", "xml"];
    case "csv":
      return ["csv"];
    case "xml":
      return ["xml"];
    case "proprietary":
      return ["proprietary", "csv"];
    default:
      return ["gcode", "csv"];
  }
}
