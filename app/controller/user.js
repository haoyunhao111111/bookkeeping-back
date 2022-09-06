const Controller = require('egg').Controller;

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller { 
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
    console.log(userInfo, '-----userInfo')
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
}

module.exports = UserController