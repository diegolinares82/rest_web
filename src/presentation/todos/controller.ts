import {Request,Response} from 'express'
import { prisma } from '../../data/postgres'
import { CreateTodoDto } from '../../domain/dtos/todo/create-todo-dto';
import { UpdateTodoDto } from '../../domain/dtos/todo/update-todo-dto';


export class TodosController{

    //DI
    constructor(){
       
    }
    
    public getTodos= async(req:Request,res:Response)=>{
      const todos = await prisma.todo.findMany()
      return res.json(todos)
    }


    public getTodoById=async(req:Request, res:Response)=>{
      const id= +req.params.id;
      if(isNaN(id)) return res.status(400).json({error:'ID argument is not a number'})
       const todo = await prisma.todo.findFirst({
        where:{
          id:id
        }
      });
     
      //const todo= todos.find(todo=> todo.id ===id);
      (todo) ? res.json(todo) : res.status(404).json({error:`TODO WITH ID ${id} not found`})
    }

    public createTodo = async(req:Request, res:Response)=>{
      const [error, createTodoDto] = CreateTodoDto.create(req.body);
      if(error) return res.status(400).json({error});
      const todo = await prisma.todo.create(
        {
          data:createTodoDto!
        }
      );
      res.json(todo)
    };

    public updateToDo= async(req:Request, res:Response)=>{
      const id= +req.params.id;
      const [error, updateToDo] = UpdateTodoDto.create({
        ...req.body, id
      })
      if(error ) return res.status(400).json({error});
      const todo= await prisma.todo.findFirst({
        where:{
          id:id
        }
      })
      if(!todo) return res.status(400).json({error:`Todo with id ${id} is not found`})
     const todoUpdate = await prisma.todo.update({
      where:{
        id:id
      },
      data: updateToDo!.values,
     })
      res.json(todoUpdate);
    }

    public deleteToDo=async(req:Request, res:Response)=>{
      const id= +req.params.id;
      if(isNaN(id)) return res.status(400).json({error:'ID argument is not a number'})
      const todo= await prisma.todo.findFirst({
        where:{
          id:id
        }
      })
      if(!todo) return res.status(400).json({error:`Todo with id ${id} is not found`})
      const todoDelete= await prisma.todo.delete({
        where:{
          id:id
        }
      });
       (todoDelete) ? res.json(todoDelete) : res.status(404).json({error:`Todo with id ${id} not found`})

    }



}