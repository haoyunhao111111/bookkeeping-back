'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 从service取数据
  async index() {
    const { ctx } = this;
    const result = await ctx.service.home.user();
    ctx.body = result
  }
  // 从query取数据
  async list() { 
    const { ctx } = this;
    const { page, size } = ctx.params;
    ctx.body = `这是第${page}页,${size}条`
  }
  // 返回html模板
  async getTitle() { 
    const { ctx } = this;
    // 默认会去view下找index.html文件，这是egg默认规定好的
    await ctx.render('index.html', {
      title: '很遗憾'
    })
  }
  // 新增用户
  async addUser() { 
    const { ctx } = this;
    const userInfo = ctx.request.body;
    try {
      const result = await ctx.service.home.addUser(userInfo);
      console.log(result, '添加用户执行结果');
      ctx.body = {
        code: 200,
        data: result.insertId,
        message: '添加成功'
      }
    } catch (error) { 
      ctx.body = {
        code: 9999,
        data: null,
        message: '添加失败'
      }
    }
  }

  // 编辑用户
  async editUser() { 
    const { ctx } = this;
    const userInfo = ctx.request.body;
    try {
      const result = await ctx.service.home.editUser(userInfo);
      console.log(result, '编辑用户执行结果');
      ctx.body = {
        code: 200,
        data: null,
        message: '编辑成功'
      }
    } catch (error) { 
      ctx.body = {
        data: null,
        code: 9999,
        message: '编辑失败'
      }
    }
  }
}

module.exports = HomeController;
