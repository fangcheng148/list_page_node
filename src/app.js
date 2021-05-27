const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 导入模型
const models = require('../db/models');
// models其实是一个对象 里面包含了：
// {
//     [modal:listdate]
//     sequelize
//     Sequelize
// }

// 专门用来处理exoress json的
app.use(express.json());

// 用来对url参数做encoded处理
// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded());

// 用来对body参数做encoded处理
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 创建任务
app.post('/create',async (req,res,next)=>{
    try {
        let { name,deadline,content } = req.body; // 需要引用'body-parser'中间件处理
        // ListData 是你要操作的数据库中表的名称
        // create()API表示新增一条数据
        let data = await models.ListData.create({
            name,
            deadline,
            content
        })
        res.json({
            data,
            message: '创建成功'
        })
    } catch (error) {
        next(error);
    }
})

// 修改任务
app.post('/update',async (req,res,next)=>{
    try {
        let { name,deadline,content,id } = req.body;
        // findOne()方法表示找到某一个
        let data = await models.ListData.findOne({
            where:{
                id
            }
        })
        if (data) {
            // 执行更新功能 update()api
            data = await data.update({
                name,
                deadline,
                content
            })
        }
        res.json({
            data
        })
    } catch (error) {
        next(error);
    }
})

// 修改任务状态、删除
app.post('/update_status',async (req,res,next)=>{
    try {
        let { id,status } = req.body;
        // ListData 是你要操作的数据库中表的名称
        // findOne()API表示找到某一个
        let data = await models.ListData.findOne({
            where:{
                id
            }
        })
        // 判断找到该条数据 并且在status有修改时触发
        if (data && status != data.status) {
            // 执行更新功能 update()API
            data = await data.update({
                status
            })
        }
        res.json({
            data
        })
    } catch (error) {
        next(error);
    }
})

// 查询任务列表
app.get('/list/:status/:page',async (req,res,next)=>{
    // 1.状态: 1:代办 2:完成 3:删除 -1:全部
    // 2.分页
    try {
        let { status,page } = req.params;
        let limit = 10; // 设置每页显示的数量
        let offset = (page - 1) * limit; // 每页开始的位置
        let where = {};
        if (status != -1) where.status = status;

        // findAndCountAll() 表示查询并且汇集总数
        let list = await models.ListData.findAndCountAll({
            where,
            limit,
            offset
        })
        res.json({
            list,
            message: '列表查询成功'
        })
    } catch (error) {
        next(error);
    }
})


// 1. 所有错误 http status == 500
app.use((err,req,res,next)=>{
    if(err) {
        res.status(500).json({
            "message": err.message
        })
    }
})

app.listen(3000, ()=>{
    console.log('server启动成功')
})