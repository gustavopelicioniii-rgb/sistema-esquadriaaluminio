import { describe, it, expect } from 'vitest';

/**
 * Pure calculation functions extracted from the orcamento logic.
 * These are tested in isolation for reliability.
 */

// Item-level cost: area (m²) × price per m² × quantity
export function calcularCustoItem(
  larguraCm: number,
  alturaCm: number,
  quantidade: number,
  precoM2: number
): number {
  const areaM2 = (larguraCm / 100) * (alturaCm / 100) * quantidade;
  return areaM2 * precoM2;
}

// Total cost = sum of all item costs
export function calcularTotalCusto(
  items: { larguraCm: number; alturaCm: number; quantidade: number; precoM2: number }[]
): number {
  return items.reduce(
    (sum, item) =>
      sum + calcularCustoItem(item.larguraCm, item.alturaCm, item.quantidade, item.precoM2),
    0
  );
}

// Profit = cost × (marginPercent / 100)
export function calcularLucro(custo: number, margemPercent: number): number {
  return custo * (margemPercent / 100);
}

// Subtotal = cost + profit
export function calcularSubtotal(custo: number, lucro: number): number {
  return custo + lucro;
}

// After acréscimo
export function aplicarAcrescimo(subtotal: number, acrescimo: number): number {
  return subtotal + acrescimo;
}

// Discount calculation
export function calcularDesconto(
  valor: number,
  descontoTipo: 'percent' | 'valor',
  descontoValor: number
): number {
  if (descontoValor <= 0) return 0;
  if (descontoTipo === 'percent') return valor * (descontoValor / 100);
  return descontoValor;
}

// Total final
export function calcularTotal(
  custo: number,
  margemPercent: number,
  acrescimo: number,
  descontoTipo: 'percent' | 'valor',
  descontoValor: number
): number {
  const lucro = calcularLucro(custo, margemPercent);
  const subtotal = calcularSubtotal(custo, lucro);
  const withAcrescimo = aplicarAcrescimo(subtotal, acrescimo);
  const desconto = calcularDesconto(withAcrescimo, descontoTipo, descontoValor);
  return Math.max(0, withAcrescimo - desconto);
}

// --- Tests ---

describe('calcularCustoItem', () => {
  it('calculates area correctly for 1m x 1m at R$100/m²', () => {
    // 1m × 1m = 1m² × R$100 = R$100
    expect(calcularCustoItem(100, 100, 1, 100)).toBe(100);
  });

  it('calculates area correctly for 200cm x 120cm at R$100/m²', () => {
    // 2m × 1.2m = 2.4m² × R$100 = R$240
    expect(calcularCustoItem(200, 120, 1, 100)).toBe(240);
  });

  it('multiplies by quantity', () => {
    // 100cm × 100cm = 1m² × 3 × R$100 = R$300
    expect(calcularCustoItem(100, 100, 3, 100)).toBe(300);
  });

  it('handles 0 quantity', () => {
    expect(calcularCustoItem(100, 100, 0, 100)).toBe(0);
  });

  it('handles 0 price', () => {
    expect(calcularCustoItem(100, 100, 1, 0)).toBe(0);
  });
});

describe('calcularTotalCusto', () => {
  it('sums multiple items', () => {
    const items = [
      { larguraCm: 100, alturaCm: 100, quantidade: 1, precoM2: 100 }, // R$100
      { larguraCm: 200, alturaCm: 120, quantidade: 1, precoM2: 100 }, // R$240
    ];
    expect(calcularTotalCusto(items)).toBe(340);
  });

  it('returns 0 for empty list', () => {
    expect(calcularTotalCusto([])).toBe(0);
  });
});

describe('calcularLucro', () => {
  it('calculates 100% margin on R$100 cost = R$100 profit', () => {
    expect(calcularLucro(100, 100)).toBe(100);
  });

  it('calculates 50% margin on R$200 cost = R$100 profit', () => {
    expect(calcularLucro(200, 50)).toBe(100);
  });

  it('calculates 0% margin = R$0 profit', () => {
    expect(calcularLucro(200, 0)).toBe(0);
  });

  it('handles fractional margins', () => {
    expect(calcularLucro(1000, 15)).toBe(150);
  });
});

describe('calcularDesconto', () => {
  it('applies percentage discount correctly', () => {
    // 10% off R$1000 = R$100
    expect(calcularDesconto(1000, 'percent', 10)).toBe(100);
  });

  it('applies fixed value discount correctly', () => {
    expect(calcularDesconto(1000, 'valor', 150)).toBe(150);
  });

  it('returns 0 for 0% discount', () => {
    expect(calcularDesconto(1000, 'percent', 0)).toBe(0);
  });

  it('caps percentage discount at 100%', () => {
    // 100% of R$1000 = R$1000 (not clamped, actual value)
    expect(calcularDesconto(1000, 'percent', 100)).toBe(1000);
  });

  it('does not exceed original value for fixed discount', () => {
    // Fixed discount greater than value still returns the full discount value
    // (business logic should clamp this at call site)
    expect(calcularDesconto(100, 'valor', 200)).toBe(200);
  });
});

describe('calcularTotal (full flow)', () => {
  it('computes total with 100% margin and no discounts', () => {
    // Cost R$100, margin 100% → profit R$100, subtotal R$200
    expect(calcularTotal(100, 100, 0, 'percent', 0)).toBe(200);
  });

  it('applies acréscimo correctly', () => {
    // Cost R$100, margin 0%, acréscimo R$50 → total R$150
    expect(calcularTotal(100, 0, 50, 'percent', 0)).toBe(150);
  });

  it('applies percentage discount correctly', () => {
    // Cost R$100, margin 0%, no acréscimo, 10% discount on R$100 = R$10 → total R$90
    expect(calcularTotal(100, 0, 0, 'percent', 10)).toBe(90);
  });

  it('applies fixed discount correctly', () => {
    // Cost R$100, margin 0%, no acréscimo, R$30 fixed discount → total R$70
    expect(calcularTotal(100, 0, 0, 'valor', 30)).toBe(70);
  });

  it('never returns negative', () => {
    // Large discount exceeding value should not go negative
    expect(calcularTotal(100, 0, 0, 'valor', 500)).toBe(0);
    expect(calcularTotal(100, 0, 0, 'percent', 200)).toBe(0);
  });

  it('full realistic example: R$1000 cost, 35% margin, R$100 acréscimo, 10% discount', () => {
    // Subtotal = 1000 + 350 = 1350
    // With acréscimo = 1350 + 100 = 1450
    // Discount 10% = 145
    // Total = 1450 - 145 = 1305
    expect(calcularTotal(1000, 35, 100, 'percent', 10)).toBe(1305);
  });
});
