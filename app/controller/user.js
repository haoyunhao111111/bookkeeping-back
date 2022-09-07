const Controller = require('egg').Controller;

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller { 
  /** 注册 */
  async register() { 
    const { ctx } = this;
    const { 
      username,
      password
    } = ctx.request.body;
    if (!username || !password) { 
      ctx.body = {
        code: 9999,
        message: '用户名或密码不能为空',
        data: null
      }
      return
    }
    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) { 
      ctx.body = {
        code: 9999,
        message: '用户名已被注册',
        data: null
      }
      return
    }

    const result = await ctx.service.user.register({
      username,
      password,
      signature: '世界和平',
      avatar: defaultAvatar
    })
    if (result) {
      ctx.body = {
        code: 0,
        message: null,
        data: null
      }
    } else { 
      ctx.body = {
        code: 500,
        message: '注册失败',
        data: null
      }
    }
  }
  /** 登陆 */
  async login() {
    const {ctx, app} = this;
    const {
      username, password
    } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    if(!userInfo || !userInfo.id) {
      ctx.body = {
        code: 9999,
        data:null,
        message: "该用户名不存在"
      }
      return
    }
    if(userInfo && userInfo.password !== password) {
      ctx.body = {
        code: 9999,
        data:null,
        message: "密码错误"
      }
      return
    }
    /** 用户信息校验成功 */
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    }, app.config.jwt.secret);
    ctx.body = {
      code: 0,
      message: '登陆成功',
      data: {
        token
      }
    }
  }

  /** 验证方法 */
  async test() {
    const { ctx,app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 0,
      message: '获取成功',
      data: {
        ...decode
      }
    }
  }

  /** 获取用户信息 */
  async getUserInfo() { 
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 0,
      message: null,
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || defaultAvatar
      }
    }
  }

  /** 编辑用户 */
  async editUserInfo() { 
    const { ctx, app } = this;
    const { signature = '', avatar = defaultAvatar} = ctx.request.body;
    try {
      console.log(signature, 'signature-----')
      let user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      user_id = decode.id;
      let userInfo = await ctx.service.user.getUserByName(decode.username);
      const params = {
        ...userInfo,
        signature,
        avatar
      }
      delete params.password
      delete params.username
      let reult = await ctx.service.user.updateUserInfo(params);
      ctx.body = {
        code: 0,
        data: null,
        message: null
      }
    } catch (err) {
      ctx.body = {
        code: 9999,
        data: null,
        message: '更新失败'
      }
    }
  }
}

module.exports = UserController