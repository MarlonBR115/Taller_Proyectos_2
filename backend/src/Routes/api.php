<?php

/** @var \Bramus\Router\Router $router */

// Rutas base de la API bajo /api
$router->mount('/api', function() use ($router) {

    // Status / Health check
    $router->get('/status', function() {
        echo json_encode(['status' => 'OK', 'message' => 'API is running']);
    });

    // Rutas de Generación de Horarios
    $router->mount('/schedule', function() use ($router) {
        $router->post('/generate', 'App\Controllers\ScheduleController@generate');
        $router->get('/all', 'App\Controllers\ScheduleController@getAll');
    });

    // Rutas para Profesores
    $router->mount('/teachers', function() use ($router) {
        $router->get('/', 'App\Controllers\TeacherController@index');
        $router->get('/(\d+)', 'App\Controllers\TeacherController@show');
        $router->post('/', 'App\Controllers\TeacherController@store');
        $router->put('/(\d+)', 'App\Controllers\TeacherController@update');
        $router->delete('/(\d+)', 'App\Controllers\TeacherController@destroy');
    });

    // Rutas para Cursos
    $router->mount('/courses', function() use ($router) {
        $router->get('/', 'App\Controllers\CourseController@index');
        $router->get('/(\d+)', 'App\Controllers\CourseController@show');
        $router->post('/', 'App\Controllers\CourseController@store');
        $router->put('/(\d+)', 'App\Controllers\CourseController@update');
        $router->delete('/(\d+)', 'App\Controllers\CourseController@destroy');
    });

    // Rutas para Aulas
    $router->mount('/rooms', function() use ($router) {
        $router->get('/', 'App\Controllers\RoomController@index');
        $router->get('/(\d+)', 'App\Controllers\RoomController@show');
        $router->post('/', 'App\Controllers\RoomController@store');
        $router->put('/(\d+)', 'App\Controllers\RoomController@update');
        $router->delete('/(\d+)', 'App\Controllers\RoomController@destroy');
    });

    // Rutas para Grupos
    $router->mount('/groups', function() use ($router) {
        $router->get('/', 'App\Controllers\StudentGroupController@index');
        $router->get('/(\d+)', 'App\Controllers\StudentGroupController@show');
        $router->post('/', 'App\Controllers\StudentGroupController@store');
        $router->put('/(\d+)', 'App\Controllers\StudentGroupController@update');
        $router->delete('/(\d+)', 'App\Controllers\StudentGroupController@destroy');
    });

    // Rutas para Periodos Académicos
    $router->mount('/terms', function() use ($router) {
        $router->get('/', 'App\Controllers\AcademicTermController@index');
        $router->get('/active', 'App\Controllers\AcademicTermController@getActive');
        $router->post('/', 'App\Controllers\AcademicTermController@store');
        $router->put('/(\d+)', 'App\Controllers\AcademicTermController@update');
        $router->delete('/(\d+)', 'App\Controllers\AcademicTermController@destroy');
    });
});
