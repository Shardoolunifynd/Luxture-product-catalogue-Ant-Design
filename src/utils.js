// Utility functions for the product catalog
export function csvEscape(val) {
  if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}
