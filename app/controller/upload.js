const fs = require('fs');
const moment = require('moment');
const mkdirp = require('mkdirp');
const path = require('path');

const Controller = require('egg').Controller;

class UploadController extends Controller { 
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    let uploadDir = '';
    try {
      let f = fs.readFileSync(file.filepath);
      let day = moment(new Date()).format('YYYYMMDD');
      let dir = path.join(this.config.uploadDir, day);
      let date = Date.now()
      await mkdirp(dir);
      uploadDir = path.join(dir, date + path.extname(file.filename));
      fs.writeFileSync(uploadDir, f);
      ctx.body = {
        code: 200,
        msg: '上传成功',
        data: uploadDir.replace(/app/g, ''),
      }
    } catch (err) {
      ctx.body = {
        code: 9999,
        message: '上传失败',
        data: null
      }
    } finally { 
      ctx.cleanupRequestFiles();
    }
  }
}

module.exports = UploadController