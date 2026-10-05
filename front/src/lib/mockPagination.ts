type CursorResult<TItem> = {
  items: TItem[];
  nextCursor: string | null;
};

type CursorOptions = {
  cursor?: string | null;
  size?: number;
  maxSize?: number;
};

const DEFAULT_SIZE = 20;
const DEFAULT_MAX = 50;

export function paginateMockData<TItem>(
  data: TItem[],
  { cursor, size = DEFAULT_SIZE, maxSize = DEFAULT_MAX }: CursorOptions,
): CursorResult<TItem> {
  const safeSize = Math.max(1, Math.min(size, maxSize));
  const startIndex = parseCursor(cursor);
  const endIndex = Math.min(startIndex + safeSize, data.length);
  const items = data.slice(startIndex, endIndex);
  const nextCursor = endIndex < data.length ? String(endIndex) : null;

  return { items, nextCursor };
}

function parseCursor(cursor?: string | null) {
  if (!cursor) return 0;
  const value = Number(cursor);
  if (Number.isNaN(value) || value < 0) return 0;
  return Math.floor(value);
}
