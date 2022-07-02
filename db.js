const homedir = require('os').homedir();
const p = require('path');
const fs = require('fs');
const dbPath = p.join(homedir, '.todo') //合并数据库文件路径，

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (error, data) => { //a+这里指当读取文件没有内容时，就会自动创建空文件
                if (error) {
                    return reject(error)
                }
                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (error2) {
                    list = []
                }
                resolve(list)
            })
        })
    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list);
            fs.writeFile(path, string + '\n', (error) => {
                if (error) {
                    return reject(error)
                }
                resolve()
            })
        })
    }

}

module.exports = db;