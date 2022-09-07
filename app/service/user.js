const Service = require('egg').Service;


class UserService extends Service { 
  /** 根据用户名查用户，防重 */
  async getUserByName(username) { 
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result
    } catch (err) { 
      console.log(err)
      return null
    }
  }

  /** 注册用户 */
  async register(userInfo) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', userInfo);
      return result
    } catch (err) { 
      return null
    }
  }

  /** 编辑用户 */
  async updateUserInfo(params) { 
    const { app } = this;
    try { 
      let result = await app.mysql.update('user', {
        ...params
      }, {
        id: params.id
      })
      console.log(result, 'result-------')
      return result
    }
    catch (err) { 
      return null
    }
  }
}

module.exports = UserService