const {Todo,User,Project} = require("../models")

class Controller{
    static create(req,res,next){
        let payload = {
            title:req.body.title,
            description: req.body.description,
            status:req.body.status,
            due_date: req.body.due_date,
            // req.currentUserId didapat dari middleware (Note: ngak pake body)
            // UserId:req.currentUserId

        }
        console.log(payload);
        Todo.create(payload)
        .then(result=>{
            let projectpayload = {
                name : "default",
                TodoId : result.id,
                UserId : req.currentUserId
            }
            Project.create(projectpayload)
            .then(result1=>{

                res.status(201).json({
                    message:"Data created Success",
                    todos:result
                })
            })
        })
        .catch(err=>{            
            next(err)
        })
    }

    static viewmember(req,res){
        User.findAll({
            attributes: ['id', 'email'],
            include:[{
                model:Project,
                required:false,
                where:{
                    TodoId:req.headers.id_todo
                }
            }]                
        })
        .then(result=>{
           
            return res.status(200).json({
                data:{result},
                msg:"find All success"
            })
        })
        .catch(err=>{
            return next({
                name :'error_manual',
                message: 'View member error'                    
            })
        })
    }

    static addmember(req,res){
        let dataDetail={
            UserId : req.body.UserId,
            TodoId : req.body.TodoId
        }        
        
        Project.create(dataDetail)
        .then(succes=>{
            
            return res.status(201).json({
                msg:"member add success"
            })
        })
        .catch(err=>{
            return next({
                name :'error_manual',
                message: 'Create task error'                    
            })
        })
    }
    static readall(req,res){        
        console.log(req.headers.status,req.currentUserId);
        
        Todo.findAll({
            where:{
                status:req.headers.status
            },
            include:[{
                model:Project,
                where:{
                    UserId:req.currentUserId
                }
            }]
        })
        .then(result=>{
            res.status(200).json({
                message:"Read all Success",
                todos:result})
        })
        .catch(err=>{
            return next({
                name :'error_manual',
                message: 'read task error'                    
            })
        })
    }
    static readone(req,res){        
        const id = req.params.id
        Todo.findByPk(+id)        
        .then(result=>{
            res.status(200).json({
                message:"Read by PK Success",
                todo:result})
        })
        .catch(err=>{
            return next({
                name :'error_manual',
                message: 'Data not found'                    
            })
            
        })
    }
    static update(req,res,next){
        const{title,description,status,due_date} = req.body
        const id = req.params.id
        
        Todo.update({title:title,description:description,status:status,due_date:due_date},{
           where:{ 
               id:id
            }
         })
        .then(result=>{
            res.status(200).json({
                message:"Updated Success",
                todo:{title,description,status,due_date}
            })
        })
        .catch(err=>{
            next(err)
        })
    }
    static updateStatus(req,res,next){
        const{status} = req.body
        const id = req.params.id
        
        Todo.update({status:status},{
           where:{ 
               id:id
            }
         })
        .then(result=>{
            res.status(200).json({
                message:"Updated Success",
                todos:result})
        })
        .catch(err=>{
            next(err)
        })
    }
    static delete(req,res,next){
        const id = req.params.id
        Project.destroy({
            where:{
                TodoId: id
            }
        })
        .then (des =>{
            Todo.destroy({where:{
                id:id
            }})
            .then(result=>{
                res.status(200).json({
                    message:"Delete Success",
                    todos:result})
            })
            .catch(err=>{
                next(err)
            })
        })
    }
}
module.exports = Controller