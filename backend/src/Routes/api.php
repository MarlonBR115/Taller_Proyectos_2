<?php

/** @var \Bramus\Router\Router $router */

// Status / Health check
$router->get('/api/status', function() {
    echo json_encode(['status' => 'OK', 'message' => 'API is running']);
});

// Rutas de Generación de Horarios
$router->post('/api/schedule/generate', 'App\Controllers\ScheduleController@generate');
$router->get('/api/schedule/all', 'App\Controllers\ScheduleController@getAll');

// Rutas para Profesores
$router->get('/api/teachers', 'App\Controllers\TeacherController@index');
$router->get('/api/teachers/(\d+)', 'App\Controllers\TeacherController@show');
$router->post('/api/teachers', 'App\Controllers\TeacherController@store');
$router->put('/api/teachers/(\d+)', 'App\Controllers\TeacherController@update');
$router->delete('/api/teachers/(\d+)', 'App\Controllers\TeacherController@destroy');

// Rutas para Cursos
$router->get('/api/courses', 'App\Controllers\CourseController@index');
$router->get('/api/courses/(\d+)', 'App\Controllers\CourseController@show');
$router->post('/api/courses', 'App\Controllers\CourseController@store');
$router->put('/api/courses/(\d+)', 'App\Controllers\CourseController@update');
$router->delete('/api/courses/(\d+)', 'App\Controllers\CourseController@destroy');

// Rutas para Aulas
$router->get('/api/rooms', 'App\Controllers\RoomController@index');
$router->get('/api/rooms/(\d+)', 'App\Controllers\RoomController@show');
$router->post('/api/rooms', 'App\Controllers\RoomController@store');
$router->put('/api/rooms/(\d+)', 'App\Controllers\RoomController@update');
$router->delete('/api/rooms/(\d+)', 'App\Controllers\RoomController@destroy');

// Rutas para Grupos
$router->get('/api/groups', 'App\Controllers\StudentGroupController@index');
$router->get('/api/groups/(\d+)', 'App\Controllers\StudentGroupController@show');
$router->post('/api/groups', 'App\Controllers\StudentGroupController@store');
$router->put('/api/groups/(\d+)', 'App\Controllers\StudentGroupController@update');
$router->delete('/api/groups/(\d+)', 'App\Controllers\StudentGroupController@destroy');

// Rutas para Periodos Académicos
$router->get('/api/terms', 'App\Controllers\AcademicTermController@index');
$router->get('/api/terms/active', 'App\Controllers\AcademicTermController@getActive');
$router->post('/api/terms', 'App\Controllers\AcademicTermController@store');
$router->put('/api/terms/(\d+)', 'App\Controllers\AcademicTermController@update');
$router->delete('/api/terms/(\d+)', 'App\Controllers\AcademicTermController@destroy');