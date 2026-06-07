const assert = require('node:assert/strict');
const test = require('node:test');

const GeneratorService = require('../GeneratorService');
const {
  TIPOS_CONFLICTO,
  adaptarHorarioGenerado,
  validateSchedule,
  validarCrucesHorario
} = require('../src/services/motorAntiCruces');

function sesion(base = {}) {
  return {
    id: 'H001',
    cursoId: 'CUR001',
    docenteId: 'DOC001',
    aulaId: 'AULA101',
    grupoId: 'G1',
    dia: 'LUNES',
    horaInicio: '08:00',
    horaFin: '10:00',
    capacidadAula: 40,
    estudiantesEstimados: 30,
    tipoAula: 'classroom',
    tipoSesion: 'theory',
    ...base
  };
}

test('horario valido sin cruces', () => {
  const resultado = validarCrucesHorario([
    sesion(),
    sesion({
      id: 'H002',
      docenteId: 'DOC002',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '10:00',
      horaFin: '12:00'
    })
  ]);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalSesiones, 2);
  assert.equal(resultado.totalConflictos, 0);
  assert.deepEqual(resultado.conflictos, []);
  assert.equal(resultado.totalAdvertencias, 0);
});

test('detecta cruce de docente', () => {
  const resultado = validarCrucesHorario([
    sesion(),
    sesion({
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
  assert.equal(resultado.conflictos[0].sesionA, 'H001');
  assert.equal(resultado.conflictos[0].sesionB, 'H002');
});

test('detecta cruce de aula', () => {
  const resultado = validarCrucesHorario([
    sesion(),
    sesion({
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
    sesion(),
    sesion({
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
    sesion(),
    sesion({
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
    sesion({ horaInicio: '08:00', horaFin: '10:00' }),
    sesion({
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

test('detecta formato de hora invalido', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H003', horaInicio: '25:10', horaFin: '10:00' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.DATOS_INVALIDOS);
  assert.match(resultado.conflictos[0].mensaje, /horaInicio/i);
});

test('horaInicio mayor o igual que horaFin es dato invalido', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H004', horaInicio: '10:00', horaFin: '10:00' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.totalConflictos, 1);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.BLOQUE_INVALIDO);
});

test('sesion sin docente es dato invalido', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H005', docenteId: '' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.DATOS_INVALIDOS);
});

test('sesion sin aula es dato invalido', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H006', aulaId: null })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.DATOS_INVALIDOS);
});

test('sesion sin dia es dato invalido', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H007', dia: '' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.DATOS_INVALIDOS);
});

test('acepta alias de campos provenientes de otras capas', () => {
  const resultado = validarCrucesHorario([
    {
      id: 'A001',
      teacher_id: 10,
      room_id: 20,
      group_id: 30,
      course_id: 40,
      day_of_week: 'Lunes',
      start_time: '08:00:00',
      end_time: '10:00:00',
      capacity: 45,
      quota: 35,
      room_type: 'classroom',
      room_type_required: 'theory'
    }
  ]);

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.equal(resultado.metricas.docentesAnalizados, 1);
  assert.equal(resultado.metricas.aulasAnalizadas, 1);
  assert.equal(resultado.metricas.gruposAnalizados, 1);
});

test('clases consecutivas son validas cuando existe margen suficiente para cambiar de aula', () => {
  const resultado = validarCrucesHorario(
    [
      sesion({ horaInicio: '08:00', horaFin: '09:40', aulaId: 'AULA101' }),
      sesion({
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

test('detecta transicion insuficiente como advertencia', () => {
  const resultado = validateSchedule(
    [
      sesion({ horaInicio: '08:00', horaFin: '10:00', aulaId: 'AULA101', grupoId: 'G1' }),
      sesion({
        id: 'H002',
        cursoId: 'CUR002',
        horaInicio: '10:05',
        horaFin: '12:00',
        aulaId: 'AULA202',
        grupoId: 'G2'
      })
    ],
    { tiempoMinimoTransicionMinutos: 10 }
  );

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalConflictos, 0);
  assert.equal(resultado.totalAdvertencias, 1);
  assert.equal(resultado.advertencias[0].tipo, TIPOS_CONFLICTO.TRANSICION_INSUFICIENTE);
  assert.equal(resultado.advertencias[0].severidad, 'MEDIA');
  assert.equal(resultado.advertencias[0].margenMinutos, 5);
});

test('detecta multiples conflictos en una sola validacion', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H001', docenteId: 'DOC001', aulaId: 'AULA101', grupoId: 'G1' }),
    sesion({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC001',
      aulaId: 'AULA101',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    }),
    sesion({
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

test('detecta sobrecupo de aula', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H008', capacidadAula: 20, estudiantesEstimados: 35 })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.SOBRECUPOS_AULA);
  assert.equal(resultado.conflictos[0].recursoId, 'AULA101');
});

test('detecta tipo de aula incompatible', () => {
  const resultado = validarCrucesHorario([
    sesion({ id: 'H009', tipoAula: 'classroom', tipoSesion: 'laboratorio' })
  ]);

  assert.equal(resultado.valido, false);
  assert.equal(resultado.conflictos[0].tipo, TIPOS_CONFLICTO.TIPO_AULA_INCOMPATIBLE);
});

test('puede reportar datos opcionales incompletos como advertencia configurable', () => {
  const resultado = validarCrucesHorario(
    [
      sesion({
        id: 'H010',
        cursoId: undefined,
        carreraId: undefined,
        ciclo: undefined,
        capacidadAula: undefined,
        estudiantesEstimados: undefined
      })
    ],
    { reportarDatosOpcionalesIncompletos: true }
  );

  assert.equal(resultado.valido, true);
  assert.equal(resultado.totalAdvertencias, 1);
  assert.equal(resultado.advertencias[0].tipo, TIPOS_CONFLICTO.DATOS_OPCIONALES_INCOMPLETOS);
});

test('respuesta publica conserva estructura y metricas verificables', () => {
  const resultado = validateSchedule([
    sesion(),
    sesion({
      id: 'H002',
      cursoId: 'CUR002',
      docenteId: 'DOC001',
      aulaId: 'AULA102',
      grupoId: 'G2',
      horaInicio: '09:00',
      horaFin: '11:00'
    }),
    sesion({ id: 'H003', horaInicio: '11:00', horaFin: '11:00' })
  ]);

  assert.equal(resultado.totalSesiones, 3);
  assert.equal(resultado.metricas.totalBloques, 3);
  assert.equal(resultado.metricas.sesionesValidas, 2);
  assert.equal(resultado.metricas.sesionesInvalidas, 1);
  assert.equal(resultado.metricas.totalConflictos, 2);
  assert.equal(resultado.metricas.conflictosPorTipo[TIPOS_CONFLICTO.DOCENTE], 1);
  assert.equal(resultado.metricas.conflictosPorTipo[TIPOS_CONFLICTO.DATOS_INVALIDOS], 1);
  assert.equal(typeof resultado.metricas.tiempoValidacionMs, 'number');
});

test('el motor no muta el arreglo original de sesiones', () => {
  const horario = [sesion({ id: 'ORIGINAL' })];
  const copia = structuredClone(horario);

  validateSchedule(horario);

  assert.deepEqual(horario, copia);
});

test('adapta horarios generados sin requerir base de datos real', () => {
  const generator = new GeneratorService({});
  const adaptado = generator.adaptarHorariosParaValidacion([
    {
      id: 1,
      teacher_id: 2,
      room_id: 3,
      group_id: 4,
      day_of_week: 'Lunes',
      start_time: '08:00:00',
      end_time: '10:00:00'
    }
  ]);

  assert.equal(adaptado[0].docenteId, 2);
  assert.equal(adaptado[0].aulaId, 3);
  assert.equal(adaptado[0].grupoId, 4);
  assert.equal(adaptado[0].horaInicio, '08:00');
  assert.equal(adaptado[0].horaFin, '10:00');
});

test('adaptarHorarioGenerado devuelve lista vacia ante entradas no arreglos', () => {
  assert.deepEqual(adaptarHorarioGenerado(null), []);
});

test('validacion de rendimiento basica con varios bloques', () => {
  const bloques = Array.from({ length: 300 }, (_, indice) => {
    const dia = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'][indice % 5];
    const hora = 8 + (indice % 10);
    const horaTexto = String(hora).padStart(2, '0');
    const horaFinTexto = String(hora + 1).padStart(2, '0');

    return sesion({
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
