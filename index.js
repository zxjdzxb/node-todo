const db = require('./db.js')
const inquirer = require('inquirer');


module.exports.add = async (title) => {
    //读取之前的任务
    const list = await db.read()
    //往里面添加一个 title 任务
    list.push({title: title, done: false})
    //存储任务到文件
    await db.write(list)
}

module.exports.clear = async () => { //清空数据库
    await db.write([])
}


module.exports.showAll = async () => { //显示数据库，并可以对其进行操作
    //读取之前的任务
    const list = await db.read();
    //打印之前的任务  forEach遍历数组
    //printTasks
    printTasks(list);
}




function markAsDone(list,index) {
    list[index].done = true;
    db.write(list).then(() => {
        // Do something after login is successful.
    });
}

function markAsUnDone(list,index) {
    list[index].done = false;
    db.write(list).then(() => {
        // Do something after login is successful.
    });
}

function updateTitle(list,index) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '新的标题',
        default: list[index].title  //这里没有 choices 选项，可以直接输入内容
    }).then(answer => {
        list[index].title = answer.title
        db.write(list).then(() => {
            // Do something after login is successful.
        });
    })
}

function remove(list,index) {
    list.splice(index, 1)
    db.write(list).then(() => {
        // Do something after login is successful.
    });
}


function askForAction(list, index) {
    const actions = {markAsDone,markAsUnDone,updateTitle,remove} //通过键值对来存储对应函数方法，如果同名就显示一个即可
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUnDone'},
            {name: '改标题', value: 'updateTitle'},
            {name: '删除', value: 'remove'},
        ]
    }).then(answer2 => {
        const action=actions[answer2.action] //把键值对里的方法函数重新赋值到对象上
        action && action(list,index) //如果有这个方法，就传值并且执行
    })
}

function askForCreateTask(list){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题'
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list).then(() => {
            // Do something after login is successful.
        });
    })
}




function printTasks(list) {
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [
                {name: '退出', value: '-1'},
                ...list.map((task, index) => {
                    return {
                        name: `${task.done ? '[√]' : '[_]'} ${index + 1} - ${task.title}`,
                        value: index.toString()
                    }
                }),
                {name: '+ 创建任务', value: '-2'}]
        })
        .then(answer => {

                const index = parseInt(answer.index);//把index变成数字格式
                if (index >= 0) {
                    //得到对应任务询问操作 askForAction
                    askForAction(list, index)
                } else if (index === -2) {
                    //创建任务
                    askForCreateTask(list)
                }

            }
        );
}
