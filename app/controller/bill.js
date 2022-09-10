const moment = require('moment');
const Controller  = require('egg').Controller;

class Bill extends Controller {
  /** 添加账单 */
  async add() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, pay_type, remark = '' } = ctx.request.body;
    if( !amount || !type_id || !type_name || !pay_type ) {
      ctx.body = {
        code: 400,
        message: '参数错误',
        data: null
      }
    }
    try{
      let user_id;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      user_id = decode.id;
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date: new Date().getTime(),
        pay_type,
        remark,
        user_id
      });
      ctx.body = {
        code: 0,
        message: null,
        data: null
      }
    } catch (err) {
      ctx.body = {
        code: 9999,
        message: '未知错误',
        data: null
      }
    }
    
  }
  /** 获取账单列表 */
  async list() {
    const { ctx, app } = this;
    try {
      const { type_id = 'all', date, page = 1, page_size = 5 } = ctx.query;
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      const user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      /** 整理数据 */
      const _list = list.filter((item) => {
        if(type_id !== 'all') {
          return moment(Number(item.date)).format('YYYY-MM') === date && type_id === item.type_id;
        }
        return moment(Number(item.date)).format('YYYY-MM') === date
      });
      let listMap = _list.reduce((curr, item) => {
        const date = moment(Number(item.date)).format('YYYY-MM-DD')
        if(curr && curr.length && curr.findIndex(item => item.date === date) > -1) {
          const index = curr.findIndex(item => item.date === date);
          curr[index].bills.push(item)
        }
        if(curr && curr.length && curr.findIndex(item => item.date === date) === -1) {
          curr.push({
            date,
            bills: [item]
          })
        }
        if(!curr.length) {
          curr.push({
            date,
            bills: [item]
          });
        }
        return curr
      }, []).sort((a, b) => moment(b.date) - moment(a.date));

      const filterListMap = listMap.slice((page - 1) * page_size, page_size * page);

      /** 获取当月的总支出，总收入 */
      console.log('list', list)
      const currentMonthCash = list.filter(item => moment(Number(item.date)).format('YYYY-MM') === date);
      const totalExpense = currentMonthCash.reduce((curr, item) => {
        if(item.type_id === 1) {
          curr += Number(item.amount);
          return curr
        }
        return 0
      }, 0);
      const totalIncome = currentMonthCash.reduce((curr, item) => {
        if(item.type_id === 2) {
          curr += Number(item.amount);
          return curr
        }
        return 0
      }, 0)

      ctx.body = {
        code: 0,
        mesage: '',
        data: {
          totalExpense,
          totalIncome,
          total: Math.ceil(listMap.length / page_size),
          list: filterListMap || []
        }
      }

    } catch(err) {
      ctx.body = {
        code: 9999,
        data: null,
        message: '未知错误'
      }
    }
  }
  /** 获取账单详情 */
  async detail() {
    const { ctx, app } = this;
    try{
      let user_id;
      const { id = '' } = ctx.request.query;
      if(!id) {
        ctx.code = {
          code: 400,
          message: 'id不能为空',
          data: null
        }
      }
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      user_id = decode.id;
      const result = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 0,
        data: result,
        message: null
      }
    } catch(err) {
      ctx.body = {
        code: 9999,
        message: '未知错误',
        data: null
      }
    }
  }
  // 编辑账单
  async update() {
    const { ctx, app } = this;
    // 账单的相关参数，这里注意要把账单的 id 也传进来
    const body = ctx.request.body;
    // 判空处理
    if (JSON.stringify(body) === '{}' || !body.id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
      return
    }

    try {
      let user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return
      user_id = decode.id
      const billInfo = await ctx.service.bill.detail(body.id, user_id);
      // 根据账单 id 和 user_id，修改账单数据
      Object.assign(billInfo, body)
      console.log(billInfo, '------params-----')
      delete billInfo.user_id
      const result = await ctx.service.bill.update(billInfo, { id:body.id, user_id });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  // 删除接口
  async delete() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;

    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }

    try {
      let user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return
      user_id = decode.id
      const result = await ctx.service.bill.delete(id, user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  async dataAnalysis() {
    const {ctx, app} = this;
    const {date = ''} = ctx.request.body;
    let user_id
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return
    user_id = decode.id;
    console.log(user_id, 'user_id')
    // 获取账单表中的账单数据
    const result = await ctx.service.bill.list(user_id);
    // 根据时间参数，筛选出当月所有的账单数据
    const start = moment(date).startOf('month').unix() * 1000; // 选择月份，月初时间
    const end = moment(date).endOf('month').unix() * 1000; // 选择月份，月末时间
    const _data = result.filter(item => (Number(item.date) > start && Number(item.date) < end));
    console.log(start, end, _data, '----------mmm---------')
    // 总支出
    const total_expense = _data.reduce((arr, cur) => {
      if (cur.pay_type == 1) {
        arr += Number(cur.amount)
      }
      return arr
    }, 0)
    // 总收入
    const total_income = _data.reduce((arr, cur) => {
      if (cur.pay_type == 2) {
        arr += Number(cur.amount)
      }
      return arr
    }, 0);
    // 获取收支构成
    let total_data = _data.reduce((arr, cur) => {
      const index = arr.findIndex(item => item.type_id == cur.type_id)
      if (index == -1) {
        arr.push({
          type_id: cur.type_id,
          type_name: cur.type_name,
          pay_type: cur.pay_type,
          number: Number(cur.amount)
        })
      }
      if (index > -1) {
        arr[index].number += Number(cur.amount)
      }
      return arr
    }, [])

    total_data = total_data.map(item => {
      item.number = Number(Number(item.number).toFixed(2))
      return item
    })

    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        total_expense: Number(total_expense).toFixed(2),
        total_income: Number(total_income).toFixed(2),
        total_data: total_data || [],
      }
    }
  }
}

module.exports = Bill;