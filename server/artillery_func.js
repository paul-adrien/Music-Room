module.exports = {
    test: test,
  }
  
//   function getRoomId(context, userEvents, next) {
//     
//     context.vars.roomId = context.vars.res_room[context.vars.res_room.length - 1]._id;
//     
//     return next();
//   }

    function test(context, userEvents, next) {
        
      return next();
  }
  
  function setToken(context, userEvents, next) {
    context.extraHeaders = { 'token': 'context.vars.accessToken' };
    return next();  
  }