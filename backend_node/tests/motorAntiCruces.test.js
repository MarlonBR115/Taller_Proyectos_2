const assert = require('node:assert/strict');
const test = require('node:test');

const {
  TIPOS_CONFLICTO,
  validateSchedule,
  validarCrucesHorario
} = require('../src/services/motorAntiCruces');

function bloque(base = {}) {
  return {
    id: 'H001',
    cursoId: 'CUR001',
    cursoNombre: 'Algoritmos',
    docenteId: 'DOC001',
    aulaId: 'AULA101',
    grupoId: 'G1',
    dia: 'LUNES',
    horaInicio: '08:00',
    horaFin: '10:00',
    ...base
  };
}

test('horario valido sin cruces', () => {
  const resultado = validarCrucesHorario([
    bloque(),
    bloque({
      id: 'H002',
      docenteId: 'DOC002',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '10:00',
      horaFin: '12:00'
    })
  ]);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.deepEqual(resultado.conflictos, []);
  assert.equal(resultado.totalAdvertencias, 0);
});

test('detecta cruce de docente', () => {
  const resultado = validarCrucesHorario([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC001',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.DOCENTE);
  assert.deepEqual(resultado.conflictos[0].bloquesInvolucrados, ['H001', 'H002']);
});

test('detecta cruce de aula', () => {
  const resultado = validarCrucesHorario([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC002',
      aulaId: 'AULA101',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.AULA);
});

test('detecta cruce de grupo', () => {
  const resultado = validarCrucesHorario([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC002',
      aulaId: 'AULA102',
      grupoId: 'G1',
      horaInicio: '09:00',
      horaFin: '11:00'
    })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.GRUPO);
});

test('mismo recurso en dias diferentes no genera conflicto', () => {
  const resultado = validarCrucesHorario([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      dia: 'MARTES',
      horaInicio: '08:30',
      horaFin: '09:30'
    })
  ]);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
});

test('clases consecutivas no se consideran cruce', () => {
  const resultado = validarCrucesHorario([
    bloque({ horaInicio: '08:00', horaFin: '10:00' }),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      horaInicio: '10:00',
      horaFin: '12:00'
    })
  ]);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.equal(resultado.totalAdvertencias, 0);
});

test('bloque con horaInicio mayor o igual que horaFin es invalido', () => {
  const resultado = validarCrucesHorario([
    bloque({ id: 'H003', horaInicio: '10:00', horaFin: '10:00' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.BLOQUE_INVALIDO);
  assert.deepEqual(resultado.conflictos[0].bloquesInvolucrados, ['H003']);
});

test('bloque sin datos minimos de recurso es invalido', () => {
  const resultado = validarCrucesHorario([
    bloque({ id: 'H004', docenteId: '' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.BLOQUE_INVALIDO);
});

test('clases consecutivas son validas cuando existe margen suficiente para cambiar de aula', () => {
  const resultado = validarCrucesHorario(
    [
      bloque({ horaInicio: '08:00', horaFin: '09:40', aulaId: 'AULA101' }),
      bloque({
        id: 'H002',
        cursoId: 'CUR002',
        horaInicio: '10:00',
        horaFin: '12:00',
        aulaId: 'AULA202'
      })
    ],
    { tiempoMinimoTransicionMinutos: 15 }
  );

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.equal(resultado.totalAdvertencias, 0);
});

test('detecta transicion insuficiente cuando el margen es menor al minimo configurado', () => {
  const resultado = validateSchedule(
    [
      bloque({ horaInicio: '08:00', horaFin: '10:00', aulaId: 'AULA101' }),
      bloque({
        id: 'H002',
        cursoId: 'CUR002',
        horaInicio: '10:05',
        horaFin: '12:00',
        aulaId: 'AULA202'
      })
    ],
    { tiempoMinimoTransicionMinutos: 10 }
  );

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.equal(resultado.totalAdvertencias, 2);
  assert.equal(resultado.advertencias[0].tipo, TIPOS_CONFLICTO.TRANSICION_INSUFICIENTE);
  assert.equal(resultado.advertencias[0].severidad, 'MEDIA');
  assert.equal(resultado.advertencias[0].margenMinutos, 5);
});

test('horario completo valido con varios bloques sin conflictos', () => {
  const resultado = validarCrucesHorario([
    bloque({ id: 'H001', docenteId: 'DOC001', aulaId: 'AULA101', grupoId: 'G1' }),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC002',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '08:00',
      horaFin: '10:00'
    }),
    bloque({
      id: 'H003',
      cursoId: 'CUR003',
      docenteId: 'DOC001',
      aulaId: 'AULA103',
      grupoId: 'G3',
      dia: 'MARTES',
      horaInicio: '09:00',
      horaFin: '11:00'
    }),
    bloque({
      id: 'H004',
      cursoId: 'CUR004',
      docenteId: 'DOC004',
      aulaId: 'AULA101',
      grupoId: 'G1',
      horaInicio: '10:00',
      horaFin: '12:00'
    })
  ]);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.deepEqual(resultado.conflictos, []);
});

test('detecta multiples conflictos en una sola validacion', () => {
  const resultado = validarCrucesHorario([
    bloque({ id: 'H001', docenteId: 'DOC001', aulaId: 'AULA101', grupoId: 'G1' }),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC001',
      aulaId: 'AULA101',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    }),
    bloque({
      id: 'H003',
      cursoId: 'CUR003',
      docenteId: 'DOC003',
      aulaId: 'AULA103',
      grupoId: 'G1',
      horaInicio: '08:30',
      horaFin: '09:30'
    })
  ]);

  const tipos = resultado.conflictos.map((conflicto) => conflicto.tipo);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 3);
  assert.deepEqual(tipos, [
    TIPOS_CONFLICTO.DOCENTE,
    TIPOS_CONFLICTO.AULA,
    TIPOS_CONFLICTO.GRUPO
  ]);
});

test('validateSchedule expone una funcion de alto nivel con la misma estructura de respuesta', () => {
  const resultado = validateSchedule([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC002',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '10:00',
      horaFin: '12:00'
    })
  ]);

  assert.deepEqual(Object.keys(resultado), [
    'valido',
    'totalConflictos',
    'conflictos',
    'totalAdvertencias',
    'advertencias',
    'metricas'
  ]);
  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.deepEqual(resultado.conflictos, []);
  assert.equal(resultado.totalAdvertencias, 0);
});

test('respuesta de conflicto conserva estructura verificable', () => {
  const resultado = validateSchedule([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC001',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    })
  ]);

  const [conflicto] = resultado.conflictos;

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(typeof conflicto.tipo, 'string');
  assert.equal(typeof conflicto.severidad, 'string');
  assert.equal(typeof conflicto.mensaje, 'string');
  assert.deepEqual(conflicto.bloquesInvolucrados, ['H001', 'H002']);
});

test('calcula metricas verificables de validacion', () => {
  const resultado = validateSchedule([
    bloque(),
    bloque({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC001',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    }),
    bloque({ id: 'H003', horaInicio: '11:00', horaFin: '11:00' })
  ]);

  assert.equal(resultado.metricas.totalBloques, 3);
  assert.equal(resultado.metricas.bloquesValidos, 2);
  assert.equal(resultado.metricas.bloquesInvalidos, 1);
  assert.equal(resultado.metricas.totalConflictos, 2);
  assert.equal(resultado.metricas.conflictosPorTipo[TIPOS_CONFLICTO.DOCENTE], 1);
  assert.equal(resultado.metricas.conflictosPorTipo[TIPOS_CONFLICTO.BLOQUE_INVALIDO], 1);
  assert.equal(typeof resultado.metricas.tiempoValidacionMs, 'number');
});

test('validacion de rendimiento basica con varios bloques', () => {
  const bloques = Array.from({ length: 300 }, (_, indice) => {
    const dia = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'][indice % 5];
    const hora = 8 + (indice % 10);
    const horaTexto = String(hora).padStart(2, '0');
    const horaFinTexto = String(hora + 1).padStart(2, '0');

    return bloque({
      id: `H${String(indice + 1).padStart(3, '0')}`,
      docenteId: `DOC${indice}`,
      aulaId: `AULA${indice}`,
      grupoId: `G${indice}`,
      dia,
      horaInicio: `${horaTexto}:00`,
      horaFin: `${horaFinTexto}:00`
    });
  });

  const resultado = validateSchedule(bloques);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.equal(resultado.metricas.totalBloques, 300);
  assert.ok(resultado.metricas.tiempoValidacionMs < 100);
});
