const Service = require('egg').Service;

class HomeService extends Service { 
    async user() { 
        return {
            title: '标题',
            content: '哈哈哈'
        }
    }
}

module.exports = HomeService;