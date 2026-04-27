const TIPOS_CONFLICTO = Object.freeze({
  DOCENTE: 'CRUCE_DOCENTE',
  AULA: 'CRUCE_AULA',
  GRUPO: 'CRUCE_GRUPO',
  BLOQUE_INVALIDO: 'BLOQUE_INVALIDO'
});

const SEVERIDAD = Object.freeze({
  ALTA: 'ALTA'
});

function validarCrucesHorario(bloques = []) {
  if (!Array.isArray(bloques)) {
    throw new TypeError('La entrada debe ser una lista de bloques horarios.');
  }

  const conflictos = [];
  const bloquesNormalizados = bloques.map(normalizarBloque);
  const bloquesValidos = [];

  for (const bloque of bloquesNormalizados) {
    if (!bloque.valido) {
      conflictos.push(crearConflictoInvalido(bloque));
      continue;
    }

    bloquesValidos.push(bloque);
  }

  for (let i = 0; i < bloquesValidos.length; i += 1) {
    for (let j = i + 1; j < bloquesValidos.length; j += 1) {
      const bloqueA = bloquesValidos[i];
      const bloqueB = bloquesValidos[j];

      if (!estanSolapados(bloqueA, bloqueB)) {
        continue;
      }

      agregarConflictoRecurso(conflictos, bloqueA, bloqueB, 'docenteId', TIPOS_CONFLICTO.DOCENTE);
      agregarConflictoRecurso(conflictos, bloqueA, bloqueB, 'aulaId', TIPOS_CONFLICTO.AULA);
      agregarConflictoRecurso(conflictos, bloqueA, bloqueB, 'grupoId', TIPOS_CONFLICTO.GRUPO);
    }
  }

  return {
    valido: conflictos.length === 0,
    totalConflictos: conflictos.length,
    conflictos
  };
}

function validateSchedule(schedule = []) {
  return validarCrucesHorario(schedule);
}

function normalizarBloque(bloque, indice) {
  const id = bloque?.id ?? `BLOQUE_${indice + 1}`;
  const inicioMinutos = convertirHoraAMinutos(bloque?.horaInicio);
  const finMinutos = convertirHoraAMinutos(bloque?.horaFin);
  const diaNormalizado = normalizarTexto(bloque?.dia);

  const valido = Boolean(
    bloque &&
      diaNormalizado &&
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

function estanSolapados(bloqueA, bloqueB) {
  return (
    bloqueA.diaNormalizado === bloqueB.diaNormalizado &&
    bloqueA.inicioMinutos < bloqueB.finMinutos &&
    bloqueB.inicioMinutos < bloqueA.finMinutos
  );
}

function agregarConflictoRecurso(conflictos, bloqueA, bloqueB, campo, tipo) {
  const recursoA = normalizarTexto(bloqueA[campo]);
  const recursoB = normalizarTexto(bloqueB[campo]);

  if (!recursoA || recursoA !== recursoB) {
    return;
  }

  conflictos.push({
    tipo,
    severidad: SEVERIDAD.ALTA,
    mensaje: crearMensajeCruce(tipo, bloqueA, bloqueB, bloqueA[campo]),
    bloquesInvolucrados: [bloqueA.id, bloqueB.id]
  });
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

module.exports = {
  TIPOS_CONFLICTO,
  validateSchedule,
  validarCrucesHorario
};
