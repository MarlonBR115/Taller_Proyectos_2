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

  assert.deepEqual(Object.keys(resultado), ['valido', 'totalConflictos', 'conflictos']);
  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.deepEqual(resultado.conflictos, []);
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
