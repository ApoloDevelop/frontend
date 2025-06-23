export function formatDate(date: string) {
  return date ? date.slice(0, 10) : "";
}

export function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const selectedDate = new Date(dateStr);
  const today = new Date();
  // Normaliza a solo fecha (sin hora)
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return !isNaN(selectedDate.getTime()) && selectedDate <= today;
}
