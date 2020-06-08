import express from "express"
import {promises} from "fs"
import { createSecretKey } from "crypto"

const router = express.Router()

const readFile = promises.readFile 
const writeFile = promises.writeFile

router.post('/',async(req,res)=>{
    let databody = req.body
    try {
        let gradedata = await readFile(gradeJson,"utf8")
        let jsondata = JSON.parse(gradedata)
        
        let {student,subject,type,value} = databody
        let time = new Date()

        databody = {id: jsondata.nextID,student: student
        ,subject: subject,type: type,value: value, timestamp:time}
        console.log(databody)
        
        jsondata.grades.push(databody)

        jsondata.nextID++

        await writeFile(gradeJson,JSON.stringify(jsondata))
        res.status(201).send(databody)
    }catch (err){
        console.log(err)
        res.status(400).send(err)
    }
})
router.put("/",async (req,res)=>{
    let databody = req.body
    try {
        let gradedata = await readFile(gradeJson,"utf8")
        let jsondata = JSON.parse(gradedata)

        let index = jsondata.grades.findIndex(grade =>{
            if(req.body.id === grade.id){
                return databody.id === grade.id
            }else{
                res.status(400).send("Id não encotrado")
            }
        })
        
        let {id,student,subject,type,value} = databody

        jsondata.grades[index] = {id:id,student:student,subject:subject,type:type,value:value,Created: jsondata.grades[index].timestamp, Updated: new Date()}

        
        await writeFile(gradeJson,JSON.stringify(jsondata))
        
    } catch (err) {
        
    }
})

router.delete("/:id",async(req,res)=>{
    let id = req.params.id
    try{
        let gradedata = await readFile(gradeJson,"utf8")
        let jsondata = JSON.parse(gradedata)

        let delid = jsondata.grades.filter(grade =>{
            return grade.id !== parseInt(id)
        })

        jsondata.grades = delid

        await writeFile(gradeJson, JSON.stringify(jsondata))

        res.status(200).send("Usuario deletado")
    }catch (err){
        res.status(400).send({error: err.message})
    }
})

router.get("/:id",async(req,res)=>{
    let id = req.params.id
    let gradedata = await readFile(gradeJson,"utf8")
    let jsondata = JSON.parse(gradedata)
    try {
        let datastudent = jsondata.grades.find(grade =>{
            return grade.id === parseInt(id)
        })
        res.status(200).send(datastudent)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

router.get('/grade/notes', async(req,res)=>{
    let databody = req.body
    try{
        let gradedata = await readFile(gradeJson,"utf8")
        let jsondata = JSON.parse(gradedata)

        let procstudent = jsondata.grades.filter(grade =>{
            return grade.student.toLowerCase() === databody.student.toLowerCase() && grade.subject.toLowerCase() === databody.subject.toLowerCase()   
        })
        if(procstudent <= 0){
            res.status(400).send("Estudante não encontrado")
        }
        let sumjob = 0
        procstudent.forEach(grade => {
            sumjob += grade.value
        });
        res.status(200).send(`O aluno ${databody.student} tem um total de ${sumjob} pontos na disciplina ${databody.subject}`)
    }catch(err){
        res.status(400).send({error: err.message})
    }
})
router.get('/grade/media', async(req,res)=>{
    let databody = req.body
    try{
        let gradedata = await readFile(gradeJson,"utf8")
        let jsondata = JSON.parse(gradedata)

        let procsubject = jsondata.grades.filter(grade =>{
            return grade.type.toLowerCase() === databody.type.toLowerCase() && grade.subject.toLowerCase() === databody.subject.toLowerCase()   
        })
        if(procsubject <= 0){
            res.status(400).send("Subject ou type não encontrado")
        } 
        let sumsub = 0
        procsubject.forEach(grade => {
            sumsub += grade.value
        });
        console.log(procsubject)
        console.log(sumsub)
        console.log(procsubject.length)
        res.status(200).send(`O subject ${databody.subject} tem uma media de ${sumsub/procsubject.length} pontos no type ${databody.type}`)
    }catch(err){
        res.status(400).send({error: err.message})
    }
})
router.get('/grade/toptres', async(req,res)=>{
    let databody = req.body
    try{
        let gradedata = await readFile(gradeJson,"utf8")
        let jsondata = JSON.parse(gradedata)
        let newtop = []

        let procsubject = jsondata.grades.filter(grade =>{
            return grade.type.toLowerCase() === databody.type.toLowerCase() && grade.subject.toLowerCase() === databody.subject.toLowerCase()   
        })
        if(procsubject <= 0){
            res.status(400).send("Subject ou type não encontrado")
        } 
        procsubject.sort((a,b)=>{
            return b.value - a.value
        })
        if(procsubject.length > 3){
            for(let i = 0 ; i < 3; i++){
                newtop.push(procsubject[i])
            }
            res.status(200).send(newtop)
        }else{
            res.status(200).send(newtop)
        }
        
    }catch(err){
        res.status(400).send({error: err.message})
    }
})

export default router