const http=require('http');
const app=require('./app');
const {Server} = require('socket.io');
const port=5000;
const {Order} = require('./models/order.model');

const server = http.createServer(app);
const io =new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET','POST']
    }
});
io.on('connection',(socket)=>{
    console.log('a new user connected',socket.id);
  

    socket.on('join',(details)=>{
        console.log('user joined',details)
        
    })
    socket.on('joinn',(details)=>{
        console.log('user joined',details)
    })

    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
    });
    socket.on('order',(data)=>{
        console.log(data);
       
    });
})





server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});
