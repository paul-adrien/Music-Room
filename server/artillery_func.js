module.exports = {
    test: test,
  }
  
//   function getRoomId(context, userEvents, next) {
//     console.log('rooms:' + context.vars.res_room);
//     context.vars.roomId = context.vars.res_room[context.vars.res_room.length - 1]._id;
//     console.log("id: " + context.vars.initId)
//     return next();
//   }

    function test(context, userEvents, next) {
        console.log('test after' + context.vars.room)
      return next();
  }
  
  function setToken(context, userEvents, next) {
    context.extraHeaders = { 'token': 'context.vars.accessToken' };
    return next();  
  }