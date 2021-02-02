<?php
$html = '<h1>Hello world</h1>';

$socket = socket_create(AF_INET, SOCK_STREAM, 0);
$connection = socket_connect($socket, 'localhost', '3001');
socket_send($socket, json_encode(['html' => $html]), 2048, MSG_EOF);

if (false !== ($bytes = socket_recv($socket, $buf, 2048, MSG_WAITALL))) {
    echo "Прочитано $bytes байта из функции socket_recv(). Закрываем сокет... \n";
    echo $buf;
} else {
    echo "Не получилось выполнить socket_recv(); причина: " . socket_strerror(socket_last_error($socket)) . "\n";
}

socket_close($socket);
