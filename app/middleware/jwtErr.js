module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    console.log(token, 'token----')
    let decode;
    if(token != 'null' && token) {
      try{
        decode = await ctx.app.jwt.verify(token, secret);
        await next()
      } catch(err) {
        console.log(err, 'err')
        ctx.status = 200;
        ctx.body = {
          code: 401,
          message: 'token已过期，请重新登录'
        }
        return
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        message: 'token不存在'
      }
      return
    }
  }
}