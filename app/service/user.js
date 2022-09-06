const Service = require('egg').Service;


class UserService extends Service { 
  /** 根据用户名查用户，防重 */
  async getUserByName(username) { 
    const { app } = this;
    try {
      console.log(username, '---username')
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
}

module.exports = UserService