type RoleKey =
  | "composer"
  | "songwriter"
  | "producer"
  | "engineer"
  | "vocalist"
  | "instrumentalist"
  | "performer"
  | "other";

export function normalizeRole(raw: string): RoleKey {
  const r = raw?.toLowerCase().trim() || "";
  if (!r) return "other";

  // equivalencias habituales

  if (r.includes("composer")) return "composer";
  if (r.includes("songwriter") || r === "writer" || r.includes("lyric"))
    return "songwriter";

  if (
    r.includes("producer") ||
    r === "prod." ||
    r.includes("co-producer") ||
    r.includes("additional producer")
  )
    return "producer";

  if (
    r.includes("engineer") ||
    r.includes("mix") ||
    r.includes("master") ||
    r.includes("record") ||
    r.includes("engineering")
  )
    return "engineer";

  if (r.includes("vocal") || r.includes("singer") || r.includes("feat"))
    return "vocalist";

  if (r.includes("instrumental") || r.includes("arranger"))
    return "instrumentalist";

  if (
    r.includes("performer") ||
    r.includes("live") ||
    r.includes("band") ||
    r.includes("group") ||
    r.includes("artist")
  )
    return "performer";

  return "other";
}

export function roleLabelEs(key: RoleKey): string | null {
  switch (key) {
    case "composer":
      return "Compositores";
    case "songwriter":
      return "Autores";
    case "producer":
      return "Productores";
    case "engineer":
      return "Ingenieros de sonido";
    case "vocalist":
      return "Vocalistas";
    case "instrumentalist":
      return "Músicos";
    case "performer":
      return "Intérpretes";
    default:
      return null; // desconocidos: ocúltalos o devuelve el original si prefieres
  }
}

export function sortCollabs(collaborators: any[]) {
  // 1) Collator común (ES, sin acentos, con números)
  const collator = new Intl.Collator("es", {
    sensitivity: "base",
    ignorePunctuation: true,
    numeric: true,
  });

  // 2) Ordenar colaboradores por nombre (A→Z)
  const collaboratorsAlpha = collaborators
    .slice()
    .sort((a, b) => collator.compare(a.name, b.name)); // a.name/b.name son strings

  // 3) Agrupar por rol y ordenar nombres dentro de cada rol
  const grouped: Record<string, string[]> = collaboratorsAlpha.reduce(
    (acc, c) => {
      const roles = c.roles?.length ? c.roles : ["Colaborador"];
      for (const role of roles) {
        (acc[role] ||= []).push(c.name);
      }
      return acc;
    },
    {}
  );

  // eliminar duplicados por rol
  for (const role of Object.keys(grouped)) {
    grouped[role] = Array.from(new Set(grouped[role])).sort((a, b) =>
      collator.compare(a, b)
    );
  }

  // 4) Ordenar los tipos de colaboradores (roles) alfabéticamente
  const priority: Record<string, number> = {
    Intérpretes: 0,
    Vocalistas: 1,
    Compositores: 2,
    Productores: 3,
    Autores: 4,
    "Ingenieros de sonido": 5,
    Músicos: 6,
  };
  const sortedRoles = Object.keys(grouped).sort(
    (a, b) =>
      (priority[a] ?? 999) - (priority[b] ?? 999) || collator.compare(a, b)
  );

  // 5) Estructura final lista para render
  const collaboratorsByRoleSorted = sortedRoles.map((role) => ({
    role,
    names: grouped[role], // ya vienen ordenados
  }));

  return collaboratorsByRoleSorted;
}
