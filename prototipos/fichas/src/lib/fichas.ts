import "server-only";

export type RoleId =
  | "buho"
  | "zorro"
  | "castor"
  | "toro"
  | "ardilla";

export type FichaRol = {
  id: RoleId;

  personaje: string;
  area: string;

  descripcion: string;

  responsabilidades: string[];

  foco: string[];

  estilo: string;
  
  motivacion?: string;
  objetivoSecreto?: string;
  restriccion?: string;
  informacionPrivada?: string[];

  atributos: {
    nombre: string;
    valor: number;
  }[];
};

export const fichas: Record<RoleId, FichaRol> = {
  buho: {
    id: "buho",

    personaje: "El Búho",
    area: "Dirección",

    descripcion:
      "Tiene una mirada global de la empresa. Coordina las áreas, define prioridades y busca que las decisiones individuales estén alineadas con el resultado general.",

    responsabilidades: [
      "Coordinar las distintas áreas de la empresa.",
      "Definir prioridades y objetivos generales.",
      "Evaluar el impacto global de las decisiones.",
      "Resolver conflictos entre sectores.",
      "Tomar decisiones estratégicas.",
    ],

    foco: [
      "Resultado global de la empresa",
      "Coordinación entre áreas",
      "Riesgos",
      "Prioridades",
      "Cumplimiento de objetivos",
    ],

    estilo:
      "Pensá en la empresa como un sistema completo. Una mejora en un área no siempre significa una mejora para toda la organización.",

    atributos: [
      {
        nombre: "Visión Sistémica",
        valor: 3,
      },
      {
        nombre: "Negociación",
        valor: 1,
      },
      {
        nombre: "Análisis",
        valor: 1,
      },
    ],
  },

  zorro: {
    id: "zorro",

    personaje: "El Zorro",
    area: "Comercial",

    descripcion:
      "Representa la relación con clientes y mercado. Busca generar oportunidades sin comprometer a la empresa con promesas que no pueda cumplir.",

    responsabilidades: [
      "Comprender las necesidades del cliente.",
      "Negociar condiciones comerciales.",
      "Analizar demanda y oportunidades.",
      "Comunicar al resto de las áreas los compromisos asumidos.",
      "Proteger la relación con los clientes.",
    ],

    foco: [
      "Cliente",
      "Demanda",
      "Ventas",
      "Compromisos",
      "Propuesta de valor",
    ],

    estilo:
      "Pensá desde la mirada del cliente, pero teniendo en cuenta qué puede cumplir realmente la empresa.",

    atributos: [
      {
        nombre: "Negociación",
        valor: 3,
      },
      {
        nombre: "Visión Sistémica",
        valor: 2,
      },
    ],
  },

  castor: {
    id: "castor",

    personaje: "El Castor",
    area: "Ingeniería",

    descripcion:
      "Analiza problemas, estudia alternativas y evalúa la viabilidad técnica de las soluciones antes de implementarlas.",

    responsabilidades: [
      "Analizar técnicamente los problemas.",
      "Identificar posibles causas.",
      "Evaluar alternativas de mejora.",
      "Estudiar la viabilidad de nuevas soluciones.",
      "Proponer mejoras en procesos y tecnología.",
    ],

    foco: [
      "Viabilidad técnica",
      "Datos",
      "Procesos",
      "Mejora continua",
      "Tecnología",
    ],

    estilo:
      "No te quedes solamente con el síntoma de un problema. Intentá entender qué está ocurriendo antes de proponer una solución.",

    atributos: [
      {
        nombre: "Análisis",
        valor: 3,
      },
      {
        nombre: "Operaciones",
        valor: 1,
      },
      {
        nombre: "Visión Sistémica",
        valor: 1,
      },
    ],
  },

  toro: {
    id: "toro",

    personaje: "El Toro",
    area: "Producción",

    descripcion:
      "Representa la operación real de la empresa. Se preocupa por la capacidad, los recursos disponibles y que las soluciones puedan funcionar en la práctica.",

    responsabilidades: [
      "Gestionar la operación diaria.",
      "Analizar capacidad productiva.",
      "Detectar problemas en el proceso.",
      "Evaluar el impacto operativo de las decisiones.",
      "Asegurar que las mejoras puedan aplicarse realmente.",
    ],

    foco: [
      "Producción",
      "Capacidad",
      "Recursos",
      "Cuellos de botella",
      "Aplicación práctica",
    ],

    estilo:
      "Pensá en lo que realmente puede hacerse en la operación. Una solución puede ser buena en teoría y no funcionar en la práctica.",

    atributos: [
      {
        nombre: "Operaciones",
        valor: 3,
      },
      {
        nombre: "Análisis",
        valor: 1,
      },
      {
        nombre: "Negociación",
        valor: 1,
      },
    ],
  },

  ardilla: {
    id: "ardilla",

    personaje: "La Ardilla",
    area: "Finanzas",

    descripcion:
      "Evalúa el impacto económico de las decisiones y busca mantener la sostenibilidad financiera de la empresa.",

    responsabilidades: [
      "Controlar el presupuesto.",
      "Analizar costos y beneficios.",
      "Evaluar inversiones.",
      "Controlar el flujo de caja.",
      "Identificar riesgos financieros.",
    ],

    foco: [
      "Presupuesto",
      "Costos",
      "Ingresos",
      "Liquidez",
      "Riesgo financiero",
    ],

    estilo:
      "No mires solamente cuánto cuesta una decisión. Pensá también qué beneficio puede generar, cuándo se recupera el dinero y qué impacto tiene sobre la caja.",

    atributos: [
      {
        nombre: "Análisis",
        valor: 2,
      },
      {
        nombre: "Negociación",
        valor: 2,
      },
      {
        nombre: "Visión Sistémica",
        valor: 1,
      },
    ],
  },
};

export function getFicha(
  role: string
): FichaRol | null {
  if (role in fichas) {
    return fichas[role as RoleId];
  }

  return null;
}