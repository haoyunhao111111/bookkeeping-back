const Service = require('egg').Service;

class HomeService extends Service { 
    async user() { 
        const { ctx, app } = this;
        const QUERY_STR = 'id,name,sex';
        let sql = `select ${QUERY_STR} from user_list`;
        try {
            const result = await app.mysql.query(sql);
            return result
        } catch (error) { 
            return []
        }
    }
    async addUser(userInfo) { 
        const { ctx, app } = this;
        try {
            const result = app.mysql.insert('user_list', userInfo);
            return result
        } catch (error) { 
            return null
        }
    }
    async editUser(userInfo) { 
        const { ctx, app } = this;
        try {
            const result = await app.mysql.update('user_list', userInfo, {
                where: {
                    id: userInfo.id
                }
            })
            return result
        } catch (error) { 
            return null
        }
    }
}

module.exports = HomeService;