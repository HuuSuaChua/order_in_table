export function generateTableCode(
  existingTables: { table_code: string }[]
): string {
  const numbers = existingTables
    .map((table) => {
      const match = table.table_code.match(/^T(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .filter((number) => number > 0);

  const nextNumber =
    numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `T${String(nextNumber).padStart(2, "0")}`;
}

export function generateTableToken(): string {
  return `table_${crypto.randomUUID().replace(/-/g, "")}`;
}