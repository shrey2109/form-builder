import { Parser } from "expr-eval";
import { Field } from "../types";

const parser = new Parser();

export function evaluateFormula(mapping: Record<string, any>, formula: string) {
  try {
    return parser.evaluate(formula, mapping);
  } catch {
    return undefined;
  }
}

export function detectCycle(fields: Field[]): boolean {
  const adj = new Map<string, string[]>();
  for (const f of fields) {
    adj.set(f.id, []);
    if (f.derived?.parents) adj.set(f.id, f.derived.parents.filter(Boolean));
  }
  const visited = new Set<string>();
  const rec = new Set<string>();
  const dfs = (u: string) => {
    visited.add(u);
    rec.add(u);
    for (const v of adj.get(u) || []) {
      if (!visited.has(v) && dfs(v)) return true;
      if (rec.has(v)) return true;
    }
    rec.delete(u);
    return false;
  };
  for (const f of fields) {
    if (!visited.has(f.id) && dfs(f.id)) return true;
  }
  return false;
}
