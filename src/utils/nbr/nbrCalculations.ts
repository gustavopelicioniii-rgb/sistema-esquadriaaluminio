// NBR 10.821-2: Esquadrias - Determinação da resistência ao vento
// Cálculo de pressão de vento para estruturas de esquadrias

export interface WindLoadResult {
  // Pressões (Pa)
  q1: number; // Pressão característica do vento
  q2: number; // Pressão de projeto
  q3: number; // Pressão de ensaio (1.5 x q2)

  // Coeficientes
  cpi: number; // Coeficiente de pressão interna
  cpe: number; // Coeficiente de pressão externa
  cgc: number; // Coeficiente de carga
  kd: number; // Fator de direção

  // Dimensões críticas (mm)
  maxWidth: number;
  maxHeight: number;

  // Classificação
  classification: 'L' | 'M' | 'H'; // Baixa, Média, Alta

  // Velocidades (m/s)
  vk: number; // Velocidade característica
  vp: number; // Velocidade de projeto

  // Messages
  warnings: string[];
  passed: boolean;
}

export interface NBRInputs {
  // Localização
  city: string;
  state: string;

  // Terreno
  terrainCategory: 'I' | 'II' | 'III' | 'IV'; // NBR 6123

  // Edificação
  buildingHeight: number; // metros
  buildingWidth: number; // metros
  buildingLength: number; // metros

  // Esquadria
  windowWidth: number; // milímetros
  windowHeight: number; // milímetros

  // Altitude
  altitude: number; // metros acima do nível do mar

  // Ruk da região (if known)
  ruk?: number;
}

// Velocidade básica do vento por estado (m/s) - NBR 6123
const baseWindSpeed: Record<string, number> = {
  AC: 30,
  AL: 35,
  AP: 30,
  AM: 28,
  BA: 40,
  CE: 35,
  DF: 40,
  ES: 38,
  GO: 40,
  MA: 32,
  MT: 35,
  MS: 35,
  MG: 38,
  PA: 32,
  PB: 35,
  PR: 42,
  PE: 35,
  PI: 35,
  RJ: 40,
  RN: 35,
  RS: 45,
  RO: 28,
  RR: 28,
  SC: 42,
  SP: 40,
  SE: 35,
  TO: 32,
};

// Terrain Factor S1 (NBR 6123 Table 2)
const terrainFactorS1: Record<string, Record<string, number>> = {
  I: { below75: 1.06, above75: 1.0 },
  II: { below75: 1.0, above75: 0.94 },
  III: { below75: 0.94, above75: 0.86 },
  IV: { below75: 0.86, above75: 0.74 },
};

// Statistical coefficient S3 (NBR 6123 Table 3)
const statisticalS3: Record<string, number> = {
  L: 1.0, // Baixa
  M: 1.05, // Média
  H: 1.1, // Alta
};

// Calculate wind load according to NBR 10.821-2
export function calculateWindLoad(inputs: NBRInputs): WindLoadResult {
  const warnings: string[] = [];

  // 1. Get basic wind speed (Vk0)
  const vk0 = baseWindSpeed[inputs.state] || 40;

  // 2. Calculate S1 (terrain factor)
  const s1Key = inputs.buildingHeight < 75 ? 'below75' : 'above75';
  const s1 = terrainFactorS1[inputs.terrainCategory][s1Key];

  // 3. Calculate S2 (topography factor, usually 1.0)
  const s2 = 1.0;

  // 4. Calculate S3 (statistical factor based on importance)
  // Using M (medium) as default for buildings
  const s3 = statisticalS3['M'];

  // 5. Characteristic wind speed
  const vk = vk0 * s1 * s2 * s3;

  // 6. Design wind speed
  const vp = 0.95 * vk;

  // 7. Pressure calculation q = 0.613 * v²
  const q1 = 0.613 * Math.pow(vk, 2); // Characteristic pressure
  const q2 = 0.613 * Math.pow(vp, 2); // Design pressure

  // 8. Building aspect ratio
  const aspectRatio =
    Math.max(inputs.buildingWidth, inputs.buildingLength) /
    Math.min(inputs.buildingWidth, inputs.buildingLength);

  // 9. Calculate Cpi (internal pressure coefficient)
  // For buildings with insignificant openings, use 0
  const cpi = 0;

  // 10. Calculate Cpe (external pressure coefficient)
  // Simplified for rectangular buildings
  let cpe = 0.8; // Default windward
  if (aspectRatio > 3) {
    cpe = 0.9; // Long building
  }

  // 11. Calculate Cgc (global coefficient)
  const cgc = cpe - cpi;

  // 12. Calculate q3 (test pressure = 1.5 * q2)
  const q3 = 1.5 * q2;

  // 13. Calculate max dimensions for classification
  const maxWidth = inputs.windowWidth;
  const maxHeight = inputs.windowHeight;

  // 14. Classification based on design pressure
  let classification: 'L' | 'M' | 'H';
  if (q2 < 400) {
    classification = 'L';
  } else if (q2 < 800) {
    classification = 'M';
  } else {
    classification = 'H';
  }

  // 15. Check if esquadria can handle the pressure
  const requiredResistance = q2 * Math.abs(cgc);
  const passed = requiredResistance < q2;

  if (!passed) {
    warnings.push(
      `Pressão requerida (${requiredResistance.toFixed(1)} Pa) excede resistência do ensaio.`
    );
  }

  if (maxWidth > 2700 || maxHeight > 2700) {
    warnings.push('Dimensões excedem limite de 2700mm para classificação padrão.');
  }

  return {
    q1,
    q2,
    q3,
    cpi,
    cpe,
    cgc,
    kd: s1,
    maxWidth,
    maxHeight,
    classification,
    vk,
    vp,
    warnings,
    passed,
  };
}

// Get classification label
export function getClassificationLabel(classification: 'L' | 'M' | 'H'): string {
  switch (classification) {
    case 'L':
      return 'Baixa (L)';
    case 'M':
      return 'Média (M)';
    case 'H':
      return 'Alta (H)';
  }
}

// Get terrain category description
export function getTerrainDescription(category: 'I' | 'II' | 'III' | 'IV'): string {
  switch (category) {
    case 'I':
      return 'Mar calmo, lagos, zona rural plana';
    case 'II':
      return 'Terrenos com poucas árvores, cercas';
    case 'III':
      return 'Suburbano, Industrial, muitas árvores';
    case 'IV':
      return 'Centros de grandes cidades, portos';
  }
}

// Format pressure result
export function formatPressureResult(result: WindLoadResult): string {
  const lines = [
    `╔════════════════════════════════════╗`,
    `║     RESULTADO - Cálculo de Vento   ║`,
    `╠════════════════════════════════════╣`,
    `║ Classificação: ${getClassificationLabel(result.classification).padEnd(24)}║`,
    `║ Vel. Característica: ${result.vk.toFixed(1).padStart(8)} m/s ║`,
    `║ Vel. Projeto: ${result.vp.toFixed(1).padStart(16)} m/s ║`,
    `╠════════════════════════════════════╣`,
    `║ Pressão Característica: ${result.q1.toFixed(1).padStart(7)} Pa ║`,
    `║ Pressão de Projeto: ${result.q2.toFixed(1).padStart(10)} Pa ║`,
    `║ Pressão de Ensaio: ${result.q3.toFixed(1).padStart(11)} Pa ║`,
    `╠════════════════════════════════════╣`,
    `║ Coef. Pressão Interna (Cpi): ${result.cpi.toFixed(2).padStart(9)} ║`,
    `║ Coef. Pressão Externa (Cpe): ${result.cpe.toFixed(2).padStart(9)} ║`,
    `║ Coef. Carga (Cgc): ${result.cgc.toFixed(2).padStart(16)} ║`,
    `╠════════════════════════════════════╣`,
    `║ Dimensões Críticas:               ║`,
    `║   Largura: ${result.maxWidth.toFixed(0).padStart(8)} mm             ║`,
    `║   Altura: ${result.maxHeight.toFixed(0).padStart(10)} mm             ║`,
    `╚════════════════════════════════════╝`,
  ];

  if (result.warnings.length > 0) {
    lines.push('');
    lines.push('⚠️  AVISOS:');
    result.warnings.forEach(w => lines.push(`  - ${w}`));
  }

  return lines.join('\n');
}

// Quick check if window passes NBR requirements
export function quickNBRCheck(
  windowWidth: number,
  windowHeight: number,
  city: string,
  state: string,
  buildingHeight: number = 10
): { passed: boolean; message: string; details?: WindLoadResult } {
  try {
    const result = calculateWindLoad({
      city,
      state,
      terrainCategory: 'II',
      buildingHeight,
      buildingWidth: 20,
      buildingLength: 20,
      windowWidth,
      windowHeight,
      altitude: 0,
    });

    const message = result.passed
      ? `✅ Esquadria aprovada para ${getClassificationLabel(result.classification)}`
      : `❌ Esquadria NÃO aprovada para este local`;

    return { passed: result.passed, message, details: result };
  } catch (error) {
    return {
      passed: false,
      message: 'Erro no cálculo. Verifique os dados.',
    };
  }
}
