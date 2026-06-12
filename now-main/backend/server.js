const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const port = 5000;
const Order = require('./models/order.model');
const logger = require('./utils/logger');


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    logger.info('socket_connected', { socketId: socket.id });

    socket.on('joinn', async (details) => {
        if (!details.email) {
            logger.warn('socket_join_rejected', { socketId: socket.id, reason: 'Missing email' });
            return;
        }
        try {
            const pendingOrders = await Order.find({ 
                email: details.email, 
                status: { $regex: /^pending$/i } // Case-insensitive match for 'pending'
            });
            socket.emit('pending-orders', {
                success: true,
                orders: pendingOrders,
            });
        } catch (err) {
            logger.error('pending_orders_fetch_failed', { socketId: socket.id, email: details.email, error: err });
            socket.emit('pending-orders', {
                success: false,
                message: 'Failed to fetch pending orders. Please try again later.',
            });
        }
    });

    socket.on('disconnect', () => {
        logger.info('socket_disconnected', { socketId: socket.id });
    });
    socket.on('order', (data) => {
        logger.debug('socket_order_event', { socketId: socket.id, payload: data });
    });
})

server.listen(port, () => {
    logger.info('server_started', { port });
});

process.on('unhandledRejection', (reason) => {
    logger.error('unhandled_rejection', {
        error: reason instanceof Error ? reason : new Error(String(reason))
    });
});

process.on('uncaughtException', (error) => {
    logger.error('uncaught_exception', { error });
});
