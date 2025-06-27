const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const port = 5000;
const Order = require('./models/order.model');


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('a new user connected', socket.id);

    socket.on('joinn', async (details) => {
        console.log('joined', details);
        if (!details.email) {
            console.log('Invalid email:', details);
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
            console.error('Error fetching pending orders:', err);
            socket.emit('pending-orders', {
                success: false,
                message: 'Failed to fetch pending orders. Please try again later.',
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
    socket.on('order', (data) => {
        console.log(data);

    });
})

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
