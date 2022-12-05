let onlineUsers = []

module.exports = io => {
  io.on("connection", socket => {

    socket.on('singleAuction', async (data) => {
      socket.join(data)
      socket.emit("singleAuction", data)
    }),

      socket.on("leave", (id) => {
        socket.leave(id)
      }),

      socket.on('bid', (id) => {
        // console.log(id)
        io.in(id).emit("bid", id)
        io.emit('updateList', 'please')
      }),

      socket.on('upload', () => {
        console.log('upload')
        io.emit('upload', 'upload')
      }),

      socket.on('login', (data) => {
        console.log('data', data)

        const user = {
          name: data,
          id: socket.id
        }
        console.log('user', user)
        onlineUsers.push(user)

        io.emit('log', onlineUsers)
      }),

      socket.on('logout', (data) => {
        console.log('data', data)
        const index = onlineUsers.findIndex(object => {
          return object.name === data;
        });

        console.log('index', index)
        onlineUsers.splice(index, 1)
        io.emit('log', onlineUsers)
      }),

      socket.on('disconnect', () => {
        const index = onlineUsers.findIndex(object => {
          return object.id === socket.id;
        });
        console.log('index', index)
        onlineUsers.splice(index, 1)
        io.emit('log', onlineUsers);
        // delete users[socket.id];
      }),

      socket.on('dummy', () => {
        console.log('ping')
      })
  })
}