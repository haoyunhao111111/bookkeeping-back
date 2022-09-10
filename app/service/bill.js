const Service = require('egg').Service;

class BillService extends Service{
    async add(params) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.insert('bill', params);
            return result
        } catch(error) {
            return null
        }
    }
    async list(user_id) {
        const { ctx, app } = this;
        try{
            const sql = `select * from bill where user_id = ${user_id}`;
            const result = await app.mysql.query(sql)
            return result
        } catch(error) {
            return null
        }
    }
    async detail (id, user_id) {
        console.log(id, user_id, '------')
        const {ctx, app} = this;
        try{
            const result = await app.mysql.get('bill', {
                id,
                user_id
            })
            return result
        } catch(err) {
            return null
        }
    }
    async update(params, info) {
        const { ctx, app } = this;
        console.log(params, info, '----')
        try {
            let result = await app.mysql.update('bill', {
                ...params
            }, info);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async delete(id, user_id) {
        const { ctx, app } = this;
        try {
            let result = await app.mysql.delete('bill', {
            id: id,
            user_id: user_id
        });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = BillService