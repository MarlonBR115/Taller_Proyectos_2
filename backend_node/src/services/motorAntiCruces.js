const TIPOS_CONFLICTO = Object.freeze({
  DOCENTE: 'CRUCE_DOCENTE',
  AULA: 'CRUCE_AULA',
  GRUPO: 'CRUCE_GRUPO',
  DATOS_INVALIDOS: 'DATOS_INVALIDOS',
  BLOQUE_INVALIDO: 'DATOS_INVALIDOS',
  SOBRECUPOS_AULA: 'SOBRECUPOS_AULA',
  TIPO_AULA_INCOMPATIBLE: 'TIPO_AULA_INCOMPATIBLE',
  TRANSICION_INSUFICIENTE: 'TRANSICION_INSUFICIENTE',
  DATOS_OPCIONALES_INCOMPLETOS: 'DATOS_OPCIONALES_INCOMPLETOS'
});

const SEVERIDAD = Object.freeze({
  ALTA: 'ALTA',
  MEDIA: 'MEDIA',
  BAJA: 'BAJA'
});

const OPCIONES_POR_DEFECTO = Object.freeze({
  tiempoMinimoTransicionMinutos: 10,
  validarCruceGrupo: true,
  reportarDatosOpcionalesIncompletos: false
});

const ALIAS = Object.freeze({
  id: ['id', 'scheduleId', 'schedule_id'],
  docenteId: ['docenteId', 'teacherId', 'teacher_id', 'docente_id'],
  aulaId: ['aulaId', 'roomId', 'room_id', 'aula_id'],
  grupoId: ['grupoId', 'groupId', 'group_id', 'grupo_id', 'seccionId', 'sectionId', 'section_id'],
  carreraId: ['carreraId', 'careerId', 'career_id', 'carrera_id'],
  ciclo: ['ciclo', 'semester', 'cycle'],
  cursoId: ['cursoId', 'courseId', 'course_id'],
  seccionId: ['seccionId', 'sectionId', 'section_id'],
  dia: ['dia', 'day', 'weekday', 'day_of_week'],
  horaInicio: ['horaInicio', 'startTime', 'start_time', 'inicio'],
  horaFin: ['horaFin', 'endTime', 'end_time', 'fin'],
  capacidadAula: ['capacidadAula', 'roomCapacity', 'room_capacity', 'capacity'],
  estudiantesEstimados: ['estudiantesEstimados', 'estimatedStudents', 'estimated_students', 'quota', 'students'],
  tipoAula: ['tipoAula', 'roomType', 'room_type', 'type'],
  tipoSesion: ['tipoSesion', 'sessionType', 'session_type', 'room_type_required']
});

const RECURSOS_DUROS = Object.freeze([
  { campo: 'docenteId', tipo: TIPOS_CONFLICTO.DOCENTE, etiqueta: 'docente' },
  { campo: 'aulaId', tipo: TIPOS_CONFLICTO.AULA, etiqueta: 'aula' },
  { campo: 'grupoId', tipo: TIPOS_CONFLICTO.GRUPO, etiqueta: 'grupo' }
]);

const RECURSOS_TRANSICION = Object.freeze([
  { campo: 'docenteId', etiqueta: 'docente' },
  { campo: 'grupoId', etiqueta: 'grupo' }
]);

function validarCrucesHorario(sesiones = [], opciones = {}) {
  if (!Array.isArray(sesiones)) {
    throw new TypeError('La entrada debe ser una lista de sesiones o bloques horarios.');
  }

  const configuracion = normalizarOpciones(opciones);
  const inicioValidacion = performance.now();
  const conflictos = [];
  const advertencias = [];
  const sesionesNormalizadas = sesiones.map((sesion, indice) => normalizarSesionHorario(sesion, indice));
  const sesionesValidas = [];
  const indicesPorRecurso = crearIndicesPorRecurso();

  for (const sesion of sesionesNormalizadas) {
    const errores = validarSesionMinima(sesion, configuracion);
    if (errores.length > 0) {
      conflictos.push(crearConflictoDatosInvalidos(sesion, errores));
      continue;
    }

    sesionesValidas.push(sesion);
    indexarSesion(indicesPorRecurso, sesion);

    const conflictoSobrecupo = validarSobrecupo(sesion);
    if (conflictoSobrecupo) conflictos.push(conflictoSobrecupo);

    const conflictoTipoAula = validarTipoAula(sesion);
    if (conflictoTipoAula) conflictos.push(conflictoTipoAula);

    const advertenciaOpcional = validarDatosOpcionales(sesion, configuracion);
    if (advertenciaOpcional) advertencias.push(advertenciaOpcional);
  }

  detectarCrucesPorRecurso(indicesPorRecurso, conflictos);
  detectarTransicionesInsuficientes(indicesPorRecurso, advertencias, configuracion);

  const metricas = calcularMetricas({
    sesiones,
    sesionesValidas,
    conflictos,
    advertencias,
    indicesPorRecurso,
    inicioValidacion
  });

  return {
    valido: conflictos.length === 0,
    totalSesiones: sesiones.length,
    totalConflictos: conflictos.length,
    conflictos,
    totalAdvertencias: advertencias.length,
    advertencias,
    metricas
  };
}

function validateSchedule(schedule = [], opciones = {}) {
  return validarCrucesHorario(schedule, opciones);
}

function validarAntiCruces(schedule = [], opciones = {}) {
  return validarCrucesHorario(schedule, opciones);
}

function normalizarOpciones(opciones) {
  const tiempo = Number(opciones.tiempoMinimoTransicionMinutos);

  return {
    tiempoMinimoTransicionMinutos:
      Number.isFinite(tiempo) && tiempo >= 0
        ? tiempo
        : OPCIONES_POR_DEFECTO.tiempoMinimoTransicionMinutos,
    validarCruceGrupo: opciones.validarCruceGrupo !== false,
    reportarDatosOpcionalesIncompletos: opciones.reportarDatosOpcionalesIncompletos === true
  };
}

function normalizarSesionHorario(sesion, indice = 0) {
  const original = sesion && typeof sesion === 'object' ? sesion : {};
  const id = obtenerAlias(original, ALIAS.id) ?? `SESION_${indice + 1}`;
  const horaInicio = formatearHora(obtenerAlias(original, ALIAS.horaInicio));
  const horaFin = formatearHora(obtenerAlias(original, ALIAS.horaFin));
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = convertirHoraAMinutos(horaFin);
  const dia = obtenerAlias(original, ALIAS.dia);

  return {
    id,
    docenteId: obtenerAlias(original, ALIAS.docenteId),
    aulaId: obtenerAlias(original, ALIAS.aulaId),
    grupoId: obtenerAlias(original, ALIAS.grupoId),
    carreraId: obtenerAlias(original, ALIAS.carreraId),
    ciclo: obtenerAlias(original, ALIAS.ciclo),
    cursoId: obtenerAlias(original, ALIAS.cursoId),
    seccionId: obtenerAlias(original, ALIAS.seccionId),
    dia,
    horaInicio,
    horaFin,
    capacidadAula: normalizarNumero(obtenerAlias(original, ALIAS.capacidadAula)),
    estudiantesEstimados: normalizarNumero(obtenerAlias(original, ALIAS.estudiantesEstimados)),
    tipoAula: obtenerAlias(original, ALIAS.tipoAula),
    tipoSesion: obtenerAlias(original, ALIAS.tipoSesion),
    edificioId: original.edificioId ?? original.buildingId ?? original.building_id,
    edificio: original.edificio ?? original.building,
    diaNormalizado: normalizarTexto(dia),
    inicioMinutos,
    finMinutos,
    original
  };
}

function adaptarHorarioGenerado(horarios = []) {
  if (!Array.isArray(horarios)) return [];
  return horarios.map((horario, indice) => normalizarSesionHorario(horario, indice));
}

function obtenerAlias(objeto, alias) {
  for (const campo of alias) {
    if (objeto[campo] !== undefined && objeto[campo] !== null && objeto[campo] !== '') {
      return objeto[campo];
    }
  }
  return undefined;
}

function formatearHora(valor) {
  if (valor === undefined || valor === null || valor === '') return undefined;
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return `${String(Math.trunc(valor)).padStart(2, '0')}:00`;
  }

  const texto = String(valor).trim();
  const coincidencia = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/.exec(texto);
  if (!coincidencia) return texto;
  return `${coincidencia[1].padStart(2, '0')}:${coincidencia[2]}`;
}

function convertirHoraAMinutos(hora) {
  if (typeof hora !== 'string') return null;

  const coincidencia = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hora.trim());
  if (!coincidencia) return null;

  return Number(coincidencia[1]) * 60 + Number(coincidencia[2]);
}

function normalizarNumero(valor) {
  if (valor === undefined || valor === null || valor === '') return undefined;
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : undefined;
}

function normalizarTexto(valor) {
  return valor === undefined || valor === null ? '' : String(valor).trim().toUpperCase();
}

function validarSesionMinima(sesion, configuracion) {
  const errores = [];

  if (!normalizarTexto(sesion.docenteId)) errores.push('Falta docenteId.');
  if (!normalizarTexto(sesion.aulaId)) errores.push('Falta aulaId.');
  if (configuracion.validarCruceGrupo && !normalizarTexto(sesion.grupoId)) errores.push('Falta grupoId.');
  if (!normalizarTexto(sesion.dia)) errores.push('Falta dia.');
  if (!sesion.horaInicio) errores.push('Falta horaInicio.');
  if (!sesion.horaFin) errores.push('Falta horaFin.');
  if (sesion.horaInicio && !Number.isInteger(sesion.inicioMinutos)) errores.push('Formato de horaInicio invalido.');
  if (sesion.horaFin && !Number.isInteger(sesion.finMinutos)) errores.push('Formato de horaFin invalido.');

  if (
    Number.isInteger(sesion.inicioMinutos) &&
    Number.isInteger(sesion.finMinutos) &&
    sesion.inicioMinutos >= sesion.finMinutos
  ) {
    errores.push('horaInicio debe ser menor que horaFin.');
  }

  return errores;
}

function validarSobrecupo(sesion) {
  if (
    sesion.capacidadAula === undefined ||
    sesion.estudiantesEstimados === undefined ||
    sesion.capacidadAula >= sesion.estudiantesEstimados
  ) {
    return null;
  }

  return crearConflicto({
    tipo: TIPOS_CONFLICTO.SOBRECUPOS_AULA,
    severidad: SEVERIDAD.ALTA,
    mensaje: `La sesion ${sesion.id} supera la capacidad del aula: ${sesion.estudiantesEstimados} estudiantes estimados para ${sesion.capacidadAula} cupos.`,
    sesionA: sesion,
    recursoId: sesion.aulaId,
    recomendacion: 'Asignar un aula con mayor capacidad o reducir el cupo estimado de la seccion.'
  });
}

function validarTipoAula(sesion) {
  if (!sesion.tipoAula || !sesion.tipoSesion || tiposCompatibles(sesion.tipoAula, sesion.tipoSesion)) {
    return null;
  }

  return crearConflicto({
    tipo: TIPOS_CONFLICTO.TIPO_AULA_INCOMPATIBLE,
    severidad: SEVERIDAD.ALTA,
    mensaje: `La sesion ${sesion.id} requiere tipo ${sesion.tipoSesion}, pero el aula esta registrada como ${sesion.tipoAula}.`,
    sesionA: sesion,
    recursoId: sesion.aulaId,
    recomendacion: 'Asignar un aula compatible con el tipo de sesion.'
  });
}

function tiposCompatibles(tipoAula, tipoSesion) {
  const aula = normalizarTipo(tipoAula);
  const sesion = normalizarTipo(tipoSesion);

  if (sesion.includes('lab') || sesion.includes('laboratorio') || sesion.includes('practica')) {
    return aula.includes('lab') || aula.includes('laboratorio');
  }

  if (sesion.includes('teoria') || sesion.includes('theory') || sesion.includes('aula')) {
    return aula.includes('teoria') || aula.includes('theory') || aula.includes('aula') || aula.includes('classroom');
  }

  return aula === sesion;
}

function normalizarTipo(valor) {
  return String(valor)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function validarDatosOpcionales(sesion, configuracion) {
  if (!configuracion.reportarDatosOpcionalesIncompletos) return null;

  const faltantes = [];
  if (!normalizarTexto(sesion.cursoId)) faltantes.push('cursoId');
  if (!normalizarTexto(sesion.carreraId)) faltantes.push('carreraId');
  if (!normalizarTexto(sesion.ciclo)) faltantes.push('ciclo');
  if (sesion.capacidadAula === undefined) faltantes.push('capacidadAula');
  if (sesion.estudiantesEstimados === undefined) faltantes.push('estudiantesEstimados');

  if (faltantes.length === 0) return null;

  return {
    tipo: TIPOS_CONFLICTO.DATOS_OPCIONALES_INCOMPLETOS,
    severidad: SEVERIDAD.BAJA,
    mensaje: `La sesion ${sesion.id} no incluye datos opcionales para analisis avanzado: ${faltantes.join(', ')}.`,
    sesionA: sesion.id,
    sesionB: null,
    dia: sesion.dia,
    horaInicio: sesion.horaInicio,
    horaFin: sesion.horaFin,
    recursoId: null,
    recomendacion: 'Completar estos campos cuando se requieran metricas academicas mas detalladas.',
    bloquesInvolucrados: [sesion.id],
    camposFaltantes: faltantes
  };
}

function crearIndicesPorRecurso() {
  return {
    docenteId: new Map(),
    aulaId: new Map(),
    grupoId: new Map()
  };
}

function indexarSesion(indicesPorRecurso, sesion) {
  for (const recurso of RECURSOS_DUROS) {
    const valor = normalizarTexto(sesion[recurso.campo]);
    if (!valor) continue;

    const clave = `${sesion.diaNormalizado}|${valor}`;
    const indice = indicesPorRecurso[recurso.campo];

    if (!indice.has(clave)) indice.set(clave, []);
    indice.get(clave).push(sesion);
  }
}

function detectarCrucesPorRecurso(indicesPorRecurso, conflictos) {
  for (const recurso of RECURSOS_DUROS) {
    for (const sesionesDelRecurso of indicesPorRecurso[recurso.campo].values()) {
      const sesionesOrdenadas = ordenarPorInicio(sesionesDelRecurso);

      for (let i = 0; i < sesionesOrdenadas.length; i += 1) {
        const sesionA = sesionesOrdenadas[i];

        for (let j = i + 1; j < sesionesOrdenadas.length; j += 1) {
          const sesionB = sesionesOrdenadas[j];

          if (sesionB.inicioMinutos >= sesionA.finMinutos) break;

          if (haySolapamiento(sesionA, sesionB)) {
            conflictos.push(crearConflictoCruce(recurso, sesionA, sesionB));
          }
        }
      }
    }
  }
}

function haySolapamiento(sesionA, sesionB) {
  return sesionA.inicioMinutos < sesionB.finMinutos && sesionB.inicioMinutos < sesionA.finMinutos;
}

function detectarTransicionesInsuficientes(indicesPorRecurso, advertencias, configuracion) {
  if (configuracion.tiempoMinimoTransicionMinutos === 0) return;

  for (const recurso of RECURSOS_TRANSICION) {
    for (const sesionesDelRecurso of indicesPorRecurso[recurso.campo].values()) {
      const sesionesOrdenadas = ordenarPorInicio(sesionesDelRecurso);

      for (let i = 0; i < sesionesOrdenadas.length - 1; i += 1) {
        const sesionActual = sesionesOrdenadas[i];
        const sesionSiguiente = sesionesOrdenadas[i + 1];
        const margen = sesionSiguiente.inicioMinutos - sesionActual.finMinutos;

        if (
          margen >= 0 &&
          margen < configuracion.tiempoMinimoTransicionMinutos &&
          requiereTransicionFisica(sesionActual, sesionSiguiente)
        ) {
          advertencias.push(
            crearAdvertenciaTransicion(
              recurso,
              sesionActual,
              sesionSiguiente,
              margen,
              configuracion.tiempoMinimoTransicionMinutos
            )
          );
        }
      }
    }
  }
}

function ordenarPorInicio(sesiones) {
  return [...sesiones].sort((a, b) => a.inicioMinutos - b.inicioMinutos || a.finMinutos - b.finMinutos);
}

function requiereTransicionFisica(sesionA, sesionB) {
  const aulaA = normalizarTexto(sesionA.aulaId);
  const aulaB = normalizarTexto(sesionB.aulaId);
  const edificioA = normalizarTexto(sesionA.edificioId ?? sesionA.edificio);
  const edificioB = normalizarTexto(sesionB.edificioId ?? sesionB.edificio);

  return Boolean((aulaA && aulaB && aulaA !== aulaB) || (edificioA && edificioB && edificioA !== edificioB));
}

function crearConflictoCruce(recurso, sesionA, sesionB) {
  const recursoId = sesionA[recurso.campo];

  return crearConflicto({
    tipo: recurso.tipo,
    severidad: SEVERIDAD.ALTA,
    mensaje: crearMensajeCruce(recurso.tipo, sesionA, sesionB, recursoId),
    sesionA,
    sesionB,
    recursoId,
    recomendacion: `Reasignar horario o recurso para evitar solapamiento de ${recurso.etiqueta}.`
  });
}

function crearConflictoDatosInvalidos(sesion, errores) {
  return crearConflicto({
    tipo: TIPOS_CONFLICTO.DATOS_INVALIDOS,
    severidad: SEVERIDAD.ALTA,
    mensaje: `La sesion ${sesion.id} tiene datos minimos invalidos: ${errores.join(' ')}`,
    sesionA: sesion,
    recursoId: null,
    recomendacion: 'Completar datos obligatorios y verificar que horaInicio sea menor que horaFin.',
    extra: { errores }
  });
}

function crearConflicto({ tipo, severidad, mensaje, sesionA, sesionB = null, recursoId, recomendacion, extra = {} }) {
  const inicio = sesionB ? Math.max(sesionA.inicioMinutos ?? 0, sesionB.inicioMinutos ?? 0) : sesionA.inicioMinutos;
  const fin = sesionB ? Math.min(sesionA.finMinutos ?? 0, sesionB.finMinutos ?? 0) : sesionA.finMinutos;

  return {
    tipo,
    severidad,
    mensaje,
    sesionA: sesionA.id,
    sesionB: sesionB?.id ?? null,
    dia: sesionA.dia,
    horaInicio: minutosAHora(inicio) ?? sesionA.horaInicio,
    horaFin: minutosAHora(fin) ?? sesionA.horaFin,
    recursoId,
    recomendacion,
    bloquesInvolucrados: sesionB ? [sesionA.id, sesionB.id] : [sesionA.id],
    ...extra
  };
}

function crearAdvertenciaTransicion(recurso, sesionA, sesionB, margen, minimo) {
  return {
    tipo: TIPOS_CONFLICTO.TRANSICION_INSUFICIENTE,
    severidad: SEVERIDAD.MEDIA,
    mensaje: `El ${recurso.etiqueta} ${sesionA[recurso.campo]} tiene ${margen} minutos para trasladarse entre ${sesionA.aulaId ?? 'aula no definida'} y ${sesionB.aulaId ?? 'aula no definida'} el dia ${sesionA.dia}; minimo configurado: ${minimo} minutos.`,
    sesionA: sesionA.id,
    sesionB: sesionB.id,
    dia: sesionA.dia,
    horaInicio: sesionA.horaFin,
    horaFin: sesionB.horaInicio,
    recursoId: sesionA[recurso.campo],
    recurso: recurso.etiqueta,
    recomendacion: 'Aumentar el margen entre clases o asignar aulas mas cercanas.',
    bloquesInvolucrados: [sesionA.id, sesionB.id],
    margenMinutos: margen,
    minimoRequeridoMinutos: minimo
  };
}

function crearMensajeCruce(tipo, sesionA, sesionB, recurso) {
  const recursoTexto = recurso ?? 'sin identificar';
  const rango = `${sesionA.horaInicio}-${sesionA.horaFin} y ${sesionB.horaInicio}-${sesionB.horaFin}`;
  const dia = sesionA.dia;

  if (tipo === TIPOS_CONFLICTO.DOCENTE) {
    return `El docente ${recursoTexto} tiene clases solapadas el dia ${dia}: ${rango}.`;
  }

  if (tipo === TIPOS_CONFLICTO.AULA) {
    return `El aula ${recursoTexto} esta asignada a clases solapadas el dia ${dia}: ${rango}.`;
  }

  return `El grupo ${recursoTexto} tiene clases solapadas el dia ${dia}: ${rango}.`;
}

function minutosAHora(valor) {
  if (!Number.isFinite(valor)) return null;
  const horas = Math.floor(valor / 60);
  const minutos = valor % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

function calcularMetricas({ sesiones, sesionesValidas, conflictos, advertencias, indicesPorRecurso, inicioValidacion }) {
  const totalSesiones = sesiones.length;
  const sesionesInvalidas = conflictos.filter((conflicto) => conflicto.tipo === TIPOS_CONFLICTO.DATOS_INVALIDOS).length;
  const totalConflictos = conflictos.length;
  const conflictosPorTipo = contarPorTipo(conflictos);
  const advertenciasPorTipo = contarPorTipo(advertencias);

  return {
    tiempoValidacionMs: redondear(performance.now() - inicioValidacion),
    conflictosPorTipo,
    advertenciasPorTipo,
    sesionesValidas: sesionesValidas.length,
    sesionesInvalidas,
    docentesAnalizados: indicesPorRecurso.docenteId.size,
    aulasAnalizadas: indicesPorRecurso.aulaId.size,
    gruposAnalizados: indicesPorRecurso.grupoId.size,
    porcentajeSesionesValidas: totalSesiones === 0 ? 100 : redondear((sesionesValidas.length / totalSesiones) * 100),
    totalSesiones,
    totalBloques: totalSesiones,
    bloquesValidos: sesionesValidas.length,
    porcentajeBloquesValidos: totalSesiones === 0 ? 100 : redondear((sesionesValidas.length / totalSesiones) * 100),
    bloquesInvalidos: sesionesInvalidas,
    totalConflictos,
    tasaConflictos: totalSesiones === 0 ? 0 : redondear(totalConflictos / totalSesiones),
    totalAdvertencias: advertencias.length,
    advertenciasTransicionInsuficiente: advertenciasPorTipo[TIPOS_CONFLICTO.TRANSICION_INSUFICIENTE] ?? 0
  };
}

function contarPorTipo(items) {
  return items.reduce((acumulado, item) => {
    acumulado[item.tipo] = (acumulado[item.tipo] ?? 0) + 1;
    return acumulado;
  }, {});
}

function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

module.exports = {
  OPCIONES_POR_DEFECTO,
  SEVERIDAD,
  TIPOS_CONFLICTO,
  adaptarHorarioGenerado,
  normalizarSesionHorario,
  validateSchedule,
  validarAntiCruces,
  validarCrucesHorario
};
