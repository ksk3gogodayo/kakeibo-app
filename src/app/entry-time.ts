export interface TimedEntry {
  id?: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
}

// Unknown times stay last in either direction; IDs only resolve ties.
export function compareEntryTime(a: TimedEntry, b: TimedEntry, oldestFirst = false): number {
  const left = a.createdAt;
  const right = b.createdAt;
  if (!left && right) return 1;
  if (left && !right) return -1;
  const comparison = left && right
    ? left.seconds - right.seconds || left.nanoseconds - right.nanoseconds : 0;
  return (oldestFirst ? comparison : -comparison) || (a.id ?? '').localeCompare(b.id ?? '');
}

export function entryTimeDate(entry: TimedEntry): Date | null {
  return entry.createdAt ? new Date(entry.createdAt.seconds * 1000 + entry.createdAt.nanoseconds / 1e6) : null;
}
