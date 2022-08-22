'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 从service取数据
  async index() {
    const { ctx } = this;
    const { title, content } = await ctx.service.home.user();
    ctx.body = {
      title,
      content
    };
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
  // post请求
  async add() { 
    const { ctx } = this;
    console.log(ctx.request.body, 'add--请求参数')
    const {
      title
    } = ctx.request.body;
    ctx.body = {
      title: '这是' + title
    }
  }
}

module.exports = HomeController;
