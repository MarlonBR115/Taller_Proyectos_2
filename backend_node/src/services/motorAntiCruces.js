const TIPOS_CONFLICTO = Object.freeze({
  DOCENTE: 'CRUCE_DOCENTE',
  AULA: 'CRUCE_AULA',
  GRUPO: 'CRUCE_GRUPO',
  BLOQUE_INVALIDO: 'BLOQUE_INVALIDO',
  TRANSICION_INSUFICIENTE: 'TRANSICION_INSUFICIENTE'
});

const SEVERIDAD = Object.freeze({
  ALTA: 'ALTA',
  MEDIA: 'MEDIA'
});

const OPCIONES_POR_DEFECTO = Object.freeze({
  tiempoMinimoTransicionMinutos: 10
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

function validarCrucesHorario(bloques = [], opciones = {}) {
  if (!Array.isArray(bloques)) {
    throw new TypeError('La entrada debe ser una lista de bloques horarios.');
  }

  const configuracion = normalizarOpciones(opciones);
  const inicioValidacion = performance.now();
  const conflictos = [];
  const advertencias = [];
  const bloquesNormalizados = bloques.map(normalizarBloque);
  const bloquesValidos = [];
  const indicesPorRecurso = crearIndicesPorRecurso();

  for (const bloque of bloquesNormalizados) {
    if (!bloque.valido) {
      conflictos.push(crearConflictoInvalido(bloque));
      continue;
    }

    bloquesValidos.push(bloque);
    indexarBloque(indicesPorRecurso, bloque);
  }

  detectarCrucesPorRecurso(indicesPorRecurso, conflictos);
  detectarTransicionesInsuficientes(indicesPorRecurso, advertencias, configuracion);

  const metricas = calcularMetricas({
    bloques,
    bloquesValidos,
    conflictos,
    advertencias,
    inicioValidacion
  });

  return {
    valido: conflictos.length === 0,
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

function normalizarOpciones(opciones) {
  const tiempo = Number(opciones.tiempoMinimoTransicionMinutos);

  return {
    tiempoMinimoTransicionMinutos:
      Number.isFinite(tiempo) && tiempo >= 0
        ? tiempo
        : OPCIONES_POR_DEFECTO.tiempoMinimoTransicionMinutos
  };
}

function normalizarBloque(bloque, indice) {
  const id = bloque?.id ?? `BLOQUE_${indice + 1}`;
  const inicioMinutos = convertirHoraAMinutos(bloque?.horaInicio);
  const finMinutos = convertirHoraAMinutos(bloque?.horaFin);
  const diaNormalizado = normalizarTexto(bloque?.dia);

  const valido = Boolean(
    bloque &&
      diaNormalizado &&
      normalizarTexto(bloque.docenteId) &&
      normalizarTexto(bloque.aulaId) &&
      normalizarTexto(bloque.grupoId) &&
      Number.isInteger(inicioMinutos) &&
      Number.isInteger(finMinutos) &&
      inicioMinutos < finMinutos
  );

  return {
    ...bloque,
    id,
    diaNormalizado,
    inicioMinutos,
    finMinutos,
    valido
  };
}

function convertirHoraAMinutos(hora) {
  if (typeof hora !== 'string') {
    return null;
  }

  const coincidencia = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hora.trim());
  if (!coincidencia) {
    return null;
  }

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  return horas * 60 + minutos;
}

function normalizarTexto(valor) {
  return typeof valor === 'string' ? valor.trim().toUpperCase() : '';
}

function crearIndicesPorRecurso() {
  return {
    docenteId: new Map(),
    aulaId: new Map(),
    grupoId: new Map()
  };
}

function indexarBloque(indicesPorRecurso, bloque) {
  for (const recurso of RECURSOS_DUROS) {
    const valor = normalizarTexto(bloque[recurso.campo]);

    if (!valor) {
      continue;
    }

    const clave = `${bloque.diaNormalizado}|${valor}`;
    const indice = indicesPorRecurso[recurso.campo];

    if (!indice.has(clave)) {
      indice.set(clave, []);
    }

    indice.get(clave).push(bloque);
  }
}

function detectarCrucesPorRecurso(indicesPorRecurso, conflictos) {
  for (const recurso of RECURSOS_DUROS) {
    for (const bloquesDelRecurso of indicesPorRecurso[recurso.campo].values()) {
      const bloquesOrdenados = ordenarPorInicio(bloquesDelRecurso);

      for (let i = 0; i < bloquesOrdenados.length; i += 1) {
        const bloqueA = bloquesOrdenados[i];

        for (let j = i + 1; j < bloquesOrdenados.length; j += 1) {
          const bloqueB = bloquesOrdenados[j];

          if (bloqueB.inicioMinutos >= bloqueA.finMinutos) {
            break;
          }

          conflictos.push(crearConflictoCruce(recurso.tipo, bloqueA, bloqueB, bloqueA[recurso.campo]));
        }
      }
    }
  }
}

function detectarTransicionesInsuficientes(indicesPorRecurso, advertencias, configuracion) {
  if (configuracion.tiempoMinimoTransicionMinutos === 0) {
    return;
  }

  for (const recurso of RECURSOS_TRANSICION) {
    for (const bloquesDelRecurso of indicesPorRecurso[recurso.campo].values()) {
      const bloquesOrdenados = ordenarPorInicio(bloquesDelRecurso);

      for (let i = 0; i < bloquesOrdenados.length - 1; i += 1) {
        const bloqueActual = bloquesOrdenados[i];
        const bloqueSiguiente = bloquesOrdenados[i + 1];
        const margen = bloqueSiguiente.inicioMinutos - bloqueActual.finMinutos;

        if (
          margen >= 0 &&
          margen < configuracion.tiempoMinimoTransicionMinutos &&
          requiereTransicionFisica(bloqueActual, bloqueSiguiente)
        ) {
          advertencias.push(
            crearAdvertenciaTransicion(
              recurso,
              bloqueActual,
              bloqueSiguiente,
              margen,
              configuracion.tiempoMinimoTransicionMinutos
            )
          );
        }
      }
    }
  }
}

function ordenarPorInicio(bloques) {
  return [...bloques].sort((a, b) => a.inicioMinutos - b.inicioMinutos || a.finMinutos - b.finMinutos);
}

function requiereTransicionFisica(bloqueA, bloqueB) {
  const aulaA = normalizarTexto(bloqueA.aulaId);
  const aulaB = normalizarTexto(bloqueB.aulaId);
  const edificioA = normalizarTexto(bloqueA.edificioId ?? bloqueA.edificio);
  const edificioB = normalizarTexto(bloqueB.edificioId ?? bloqueB.edificio);

  return Boolean((aulaA && aulaB && aulaA !== aulaB) || (edificioA && edificioB && edificioA !== edificioB));
}

function crearConflictoCruce(tipo, bloqueA, bloqueB, recurso) {
  return {
    tipo,
    severidad: SEVERIDAD.ALTA,
    mensaje: crearMensajeCruce(tipo, bloqueA, bloqueB, recurso),
    bloquesInvolucrados: [bloqueA.id, bloqueB.id]
  };
}

function crearAdvertenciaTransicion(recurso, bloqueA, bloqueB, margen, minimo) {
  return {
    tipo: TIPOS_CONFLICTO.TRANSICION_INSUFICIENTE,
    severidad: SEVERIDAD.MEDIA,
    recurso: recurso.etiqueta,
    mensaje: `El ${recurso.etiqueta} ${bloqueA[recurso.campo]} tiene solo ${margen} minutos para trasladarse entre ${bloqueA.aulaId ?? 'aula no definida'} y ${bloqueB.aulaId ?? 'aula no definida'} el dia ${bloqueA.dia}; minimo configurado: ${minimo} minutos.`,
    bloquesInvolucrados: [bloqueA.id, bloqueB.id],
    margenMinutos: margen,
    minimoRequeridoMinutos: minimo
  };
}

function crearMensajeCruce(tipo, bloqueA, bloqueB, recurso) {
  const recursoTexto = recurso ?? 'sin identificar';
  const rango = `${bloqueA.horaInicio}-${bloqueA.horaFin} y ${bloqueB.horaInicio}-${bloqueB.horaFin}`;
  const dia = bloqueA.dia;

  if (tipo === TIPOS_CONFLICTO.DOCENTE) {
    return `El docente ${recursoTexto} tiene clases solapadas el dia ${dia}: ${rango}.`;
  }

  if (tipo === TIPOS_CONFLICTO.AULA) {
    return `El aula ${recursoTexto} esta asignada a clases solapadas el dia ${dia}: ${rango}.`;
  }

  return `El grupo ${recursoTexto} tiene clases solapadas el dia ${dia}: ${rango}.`;
}

function crearConflictoInvalido(bloque) {
  return {
    tipo: TIPOS_CONFLICTO.BLOQUE_INVALIDO,
    severidad: SEVERIDAD.ALTA,
    mensaje: `El bloque ${bloque.id} tiene un rango horario invalido o datos minimos incompletos.`,
    bloquesInvolucrados: [bloque.id]
  };
}

function calcularMetricas({ bloques, bloquesValidos, conflictos, advertencias, inicioValidacion }) {
  const totalBloques = bloques.length;
  const totalConflictos = conflictos.length;
  const bloquesInvalidos = conflictos.filter(
    (conflicto) => conflicto.tipo === TIPOS_CONFLICTO.BLOQUE_INVALIDO
  ).length;
  const bloquesValidosCantidad = bloquesValidos.length;
  const conflictosPorTipo = contarPorTipo(conflictos);

  return {
    totalBloques,
    bloquesValidos: bloquesValidosCantidad,
    porcentajeBloquesValidos: totalBloques === 0 ? 100 : redondear((bloquesValidosCantidad / totalBloques) * 100),
    bloquesInvalidos,
    totalConflictos,
    tasaConflictos: totalBloques === 0 ? 0 : redondear(totalConflictos / totalBloques),
    conflictosPorTipo,
    totalAdvertencias: advertencias.length,
    advertenciasTransicionInsuficiente: advertencias.filter(
      (advertencia) => advertencia.tipo === TIPOS_CONFLICTO.TRANSICION_INSUFICIENTE
    ).length,
    tiempoValidacionMs: redondear(performance.now() - inicioValidacion)
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
  validateSchedule,
  validarCrucesHorario
};
