#!/usr/bin/env node

const program  = require('commander');
const api = require('./index.js')
const pkg = require('./package.json')

program
    .version(pkg.version)
program
    .command('add') //添加子命令
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0,-1).join(' ')
        api.add(words).then(()=>{console.log('添加成功')},()=>{console.log('添加失败')})
    });
program
    .command('clear') //添加子命令
    .description('clear all task')
    .action(() => {
        api.clear().then(()=>{console.log('添加成功')},()=>{console.log('添加失败')});
    });


program.parse(process.argv); //这个argv会显示出当前命令有几个

if (process.argv.length === 2){
    //说用用户只运行node cli 显示出当前有哪些待处理的命令
    //这里void命令没有意义，只是单纯的消除警告
    void api.showAll();
}
