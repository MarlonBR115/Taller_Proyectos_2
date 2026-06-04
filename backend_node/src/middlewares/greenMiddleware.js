const { co2 } = require('@tgwf/co2');

// Instancia el calculador de CO2 usando el modelo Sustainable Web Design (swd)
const swd = new co2({ model: "swd" });

const greenMiddleware = (req, res, next) => {
    // Guardamos la referencia original de res.send
    const originalSend = res.send;

    // Sobrescribimos res.send para interceptar la respuesta antes de enviarla
    res.send = function (body) {
        // Obtenemos el tamaño del cuerpo en bytes
        // Dependiendo de si es un string o un buffer
        let byteLength = 0;
        if (Buffer.isBuffer(body)) {
            byteLength = body.length;
        } else if (typeof body === 'string') {
            byteLength = Buffer.byteLength(body, 'utf8');
        } else if (body) {
            // Si es un objeto, lo stringificamos para obtener su peso aproximado
            byteLength = Buffer.byteLength(JSON.stringify(body), 'utf8');
        }

        // Calculamos los gramos de CO2 basados en los bytes
        // swd.perByte recibe la cantidad de bytes transferidos
        const co2Grams = swd.perByte(byteLength);

        // Agregamos el header personalizado con el cálculo
        // Usamos setHeader porque a este punto los headers podrían no haberse enviado aún
        res.setHeader('X-Carbon-Footprint-Grams', co2Grams.toFixed(6));
        res.setHeader('X-Response-Bytes', byteLength);

        // Imprimimos el log en el servidor para monitoreo
        console.log(`🌱 [GreenOps] ${req.method} ${req.originalUrl} - Payload: ${byteLength} bytes -> Estimación: ${co2Grams.toFixed(6)}g de CO2`);

        // Restauramos el método original y lo ejecutamos
        res.send = originalSend;
        return res.send(body);
    };

    next();
};

module.exports = greenMiddleware;
