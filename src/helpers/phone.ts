export function splitPhone(phone: string): { prefix: string; number: string } {
  if (!phone) return { prefix: "", number: "" };

  let match = phone.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) {
    return { prefix: match[1], number: match[2] };
  }

  match = phone.match(/^(\+\d{1,4})(\d{6,})$/);
  if (match) {
    return { prefix: match[1], number: match[2] };
  }
  return { prefix: "", number: phone };
}

export function getFullPhone(number: string, prefix: string) {
  return prefix && number ? `${prefix} ${number}`.trim() : "";
}
