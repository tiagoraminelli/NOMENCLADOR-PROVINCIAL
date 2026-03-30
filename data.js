// ============================================
// NOMENCLADOR DE ENFERMERÍA 2026
// Colegio de Profesionales en Enfermería de Santa Fe
// Basado en documento oficial páginas 19-22
// ============================================

// Valores UPE según modalidad (documento página 4-5)
const VALORES_UPE = {
    CD: 1080.37,   // Consultorio Diurno
    CN: 1559.96,   // Consultorio Nocturno (20hs a 7hs)
    DD: 1559.96,   // Domicilio Diurno
    DN: 1860.70    // Domicilio Nocturno
};

// Lista completa de prestaciones extraídas del PDF (páginas 19-22)
// Formato: { nombre, tiempoEnMinutos, upe }
const nomencladorRaw = [
    { nombre: "Acompañante del paciente", tiempo: 60, upe: 20 },
    { nombre: "Administración de citostático", tiempo: 60, upe: 20 },
    { nombre: "Administración de nutrición parenteral", tiempo: 45, upe: 15 },
    { nombre: "Administración de nutrición enteral", tiempo: 45, upe: 15 },
    { nombre: "Administración de vacunas", tiempo: 15, upe: 5 },
    { nombre: "Alimentación por biberón", tiempo: 9, upe: 3 },
    { nombre: "Alimentación por gastrostomía", tiempo: 45, upe: 15 },
    { nombre: "Alimentación por sonda nasogástrica", tiempo: 21, upe: 7 },
    { nombre: "Aplicación de calor", tiempo: 6, upe: 2 },
    { nombre: "Aplicación de frío", tiempo: 6, upe: 2 },
    { nombre: "Asistencia en examen clínico", tiempo: 15, upe: 5 },
    { nombre: "Aspiración de secreciones bucales", tiempo: 6, upe: 2 },
    { nombre: "Aspiración de secreciones nasales", tiempo: 6, upe: 2 },
    { nombre: "Aspiración secreciones traqueostomía", tiempo: 9, upe: 3 },
    { nombre: "Aspiración secreciones tubo endotraqueal", tiempo: 9, upe: 3 },
    { nombre: "Ayuda en alimentación oral", tiempo: 21, upe: 7 },
    { nombre: "Ayuda en higiene parcial", tiempo: 21, upe: 7 },
    { nombre: "Ayuda en la marcha", tiempo: 12, upe: 4 },
    { nombre: "Baño de ducha o bañera", tiempo: 21, upe: 7 },
    { nombre: "Baño Parcial en cama", tiempo: 21, upe: 7 },
    { nombre: "Baño total en Cama", tiempo: 30, upe: 10 },
    { nombre: "Cambio de decúbito", tiempo: 45, upe: 15 },
    { nombre: "Cambio de frasco", tiempo: 6, upe: 2 },
    { nombre: "Cambio de pañal", tiempo: 21, upe: 7 },
    { nombre: "Cambio de traqueoflex", tiempo: 15, upe: 5 },
    { nombre: "Cambios de posición", tiempo: 15, upe: 5 },
    { nombre: "Colocación de gotas oftálmicas", tiempo: 6, upe: 2 },
    { nombre: "Colocación de bolsa de colostomía", tiempo: 12, upe: 4 },
    { nombre: "Colocación de bolsa de ileostomía", tiempo: 12, upe: 4 },
    { nombre: "Colocación de bolsa recolectora de orina", tiempo: 6, upe: 2 },
    { nombre: "Colocación de chata", tiempo: 18, upe: 6 },
    { nombre: "Colocación de elementos de confort", tiempo: 6, upe: 2 },
    { nombre: "Colocación de gotas óticas", tiempo: 6, upe: 2 },
    { nombre: "Colocación de orinal", tiempo: 18, upe: 6 },
    { nombre: "Colocación de parches", tiempo: 15, upe: 5 },
    { nombre: "Colocación de sonda nasogástrica", tiempo: 21, upe: 7 },
    { nombre: "Colocación de sonda nasoyeyunal", tiempo: 21, upe: 7 },
    { nombre: "Colocación de sonda orofaríngea", tiempo: 21, upe: 7 },
    { nombre: "Colocación de sonda vesical", tiempo: 27, upe: 9 },
    { nombre: "Colocación de urodrop", tiempo: 6, upe: 2 },
    { nombre: "Colocación de venoclisis", tiempo: 30, upe: 10 },
    { nombre: "Confección de registros", tiempo: 6, upe: 2 },
    { nombre: "Consejería en lactancia materna", tiempo: 21, upe: 7 },
    { nombre: "Control de Glucotest", tiempo: 3, upe: 1 },
    { nombre: "Control de débito de fístulas", tiempo: 15, upe: 5 },
    { nombre: "Control de Goteo", tiempo: 6, upe: 2 },
    { nombre: "Control de modalidad de ventiladores", tiempo: 45, upe: 15 },
    { nombre: "Control de peso", tiempo: 6, upe: 2 },
    { nombre: "Control de Presión Venosa Central", tiempo: 6, upe: 2 },
    { nombre: "Control de talla", tiempo: 6, upe: 2 },
    { nombre: "Cuidado de colostomía", tiempo: 21, upe: 7 },
    { nombre: "Cuidado de nefrectomía", tiempo: 15, upe: 5 },
    { nombre: "Cuidado de pie diabético", tiempo: 45, upe: 15 },
    { nombre: "Cuidado del paciente con EPOC", tiempo: 30, upe: 10 },
    { nombre: "Cuidado paciente traqueostomizado", tiempo: 24, upe: 8 },
    { nombre: "Cuidado posmorten en domicilio", tiempo: 45, upe: 15 },
    { nombre: "Cuidados al paciente en AMR", tiempo: 45, upe: 15 },
    { nombre: "Cuidados al paciente pos-quimio", tiempo: 15, upe: 5 },
    { nombre: "Cuidados de los avenamientos pleurales", tiempo: 15, upe: 5 },
    { nombre: "Cuidados de los drenajes abdominales", tiempo: 15, upe: 5 },
    { nombre: "Curación compleja", tiempo: 30, upe: 10 },
    { nombre: "Curación de abscesos", tiempo: 21, upe: 7 },
    { nombre: "Curación de escaras por decúbito compleja", tiempo: 30, upe: 10 },
    { nombre: "Curación de escaras por decúbito", tiempo: 21, upe: 7 },
    { nombre: "Curación de forúnculo", tiempo: 21, upe: 7 },
    { nombre: "Curación de port", tiempo: 15, upe: 5 },
    { nombre: "Curación de vía central", tiempo: 15, upe: 5 },
    { nombre: "Curación simple", tiempo: 18, upe: 6 },
    { nombre: "Diálisis Peritoneal", tiempo: 90, upe: 30 },
    { nombre: "Drenaje Postural", tiempo: 9, upe: 3 },
    { nombre: "Educación al paciente y familiar", tiempo: 45, upe: 15 },
    { nombre: "Ejercicio activos y pasos de rehabilitación", tiempo: 45, upe: 15 },
    { nombre: "Ejercicios Respiratorios", tiempo: 6, upe: 2 },
    { nombre: "Enema de Murphy", tiempo: 30, upe: 10 },
    { nombre: "Enema evacuante", tiempo: 21, upe: 7 },
    { nombre: "Entrevista al paciente", tiempo: 15, upe: 5 },
    { nombre: "Extracción de puntos de sutura", tiempo: 12, upe: 4 },
    { nombre: "Extracción de sangre", tiempo: 15, upe: 5 },
    { nombre: "Faja de cuerpo", tiempo: 12, upe: 4 },
    { nombre: "Lavado de boca", tiempo: 6, upe: 2 },
    { nombre: "Lavado de cabello", tiempo: 21, upe: 7 },
    { nombre: "Lavado de oído", tiempo: 9, upe: 3 },
    { nombre: "Lavado de sonda vesical", tiempo: 30, upe: 10 },
    { nombre: "Lavajes vaginales con medicamentos", tiempo: 45, upe: 15 },
    { nombre: "Medicación intravenosa por goteo", tiempo: 45, upe: 15 },
    { nombre: "Medicación por Tubuladura y/o colateral", tiempo: 9, upe: 3 },
    { nombre: "Medicación Vía Cutánea", tiempo: 6, upe: 2 },
    { nombre: "Medicación Vía Intradérmica", tiempo: 6, upe: 2 },
    { nombre: "Medicación Vía Intramuscular", tiempo: 15, upe: 5 },
    { nombre: "Medicación Vía Intravenosa", tiempo: 15, upe: 5 },
    { nombre: "Medicación Vía Nasal", tiempo: 6, upe: 2 },
    { nombre: "Medicación Vía Oral", tiempo: 6, upe: 2 },
    { nombre: "Medicación Vía Rectal", tiempo: 9, upe: 3 },
    { nombre: "Medicación Vía Subcutánea", tiempo: 6, upe: 2 },
    { nombre: "Medicación Vía Sublingual", tiempo: 6, upe: 2 },
    { nombre: "Medicación Vía Vaginal", tiempo: 9, upe: 3 },
    { nombre: "Medición de micción horaria", tiempo: 6, upe: 2 },
    { nombre: "Nebulizaciones", tiempo: 12, upe: 4 },
    { nombre: "Oxígeno por bigotera", tiempo: 12, upe: 4 },
    { nombre: "Oxígeno por máscara", tiempo: 12, upe: 4 },
    { nombre: "Oxígeno por traqueóstomía", tiempo: 12, upe: 4 },
    { nombre: "Pesaje de pañales en lactantes", tiempo: 6, upe: 2 },
    { nombre: "Rasurado Higiénico", tiempo: 9, upe: 3 },
    { nombre: "Saturometría", tiempo: 6, upe: 2 },
    { nombre: "Sujeción de paciente", tiempo: 12, upe: 4 },
    { nombre: "Traslado de cama a camilla", tiempo: 12, upe: 4 },
    { nombre: "Tratamiento de Escabiosis", tiempo: 30, upe: 10 },
    { nombre: "Tratamiento de Impétigo", tiempo: 30, upe: 10 },
    { nombre: "Tratamiento de Pediculosis", tiempo: 21, upe: 7 },
    { nombre: "Valoración de la Diuresis", tiempo: 6, upe: 2 },
    { nombre: "Valoración de la función respiratoria adulto", tiempo: 6, upe: 2 },
    { nombre: "Valoración de la función respiratoria pediátrico", tiempo: 12, upe: 4 },
    { nombre: "Valoración de las deposiciones", tiempo: 6, upe: 2 },
    { nombre: "Valoración de permeabilidad de catéter", tiempo: 9, upe: 3 },
    { nombre: "Valoración de Signos Vitales", tiempo: 18, upe: 6 },
    { nombre: "Valoración de temperatura", tiempo: 6, upe: 2 },
    { nombre: "Valoración de Tensión Arterial", tiempo: 9, upe: 3 },
    { nombre: "Valoración del dolor", tiempo: 6, upe: 2 },
    { nombre: "Valoración del estado de conciencia", tiempo: 12, upe: 4 },
    { nombre: "Valoración del signo de Godet", tiempo: 6, upe: 2 },
    { nombre: "Vendaje elástico", tiempo: 9, upe: 3 },
    { nombre: "Visita Domiciliaria", tiempo: 21, upe: 7 }
];

// Construir array completo con precios calculados
const prestacionesCompletas = nomencladorRaw.map(item => {
    const upeDecimal = parseFloat((item.upe).toFixed(2));
    return {
        nombre: item.nombre,
        tiempo: item.tiempo,
        upe: upeDecimal,
        valores: {
            CD: parseFloat((item.upe * VALORES_UPE.CD).toFixed(2)),
            CN: parseFloat((item.upe * VALORES_UPE.CN).toFixed(2)),
            DD: parseFloat((item.upe * VALORES_UPE.DD).toFixed(2)),
            DN: parseFloat((item.upe * VALORES_UPE.DN).toFixed(2))
        }
    };
});

// Datos adicionales para calculadora de hora
const HORA_ENFERMERIA = {
    adulto: { minimo: 15, moderado: 20, especial: 25 },
    pediatrico: { minimo: 25, moderado: 30, especial: 35 }
};

// Auditoría
const AUDITORIA = {
    baja: 19769.27,
    mediana: 29090.86,
    alta: 34797.33
};

// Salud Laboral
const SALUD_LABORAL = {
    consultorioSalidaTerreno: { upe: 15, diurno: 16205.55, nocturno: 23399.40 },
    especialista: { upe: 25, diurno: 27009.25, nocturno: 38999.00 }
};

// Guardias Ambulancia
const GUARDIAS_AMBULANCIA = {
    medianaComplejidad: { upe: 15, diurno: 16205.55, nocturno: 23399.40 },
    maximaComplejidad: { upe: 25, diurno: 27009.25, nocturno: 38999.00 }
};