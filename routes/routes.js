import express from "express"
import {promises} from "fs"

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
             return req.body.id === grade.id
        })

        let {id,student,subject,type,value} = databody

        jsondata.grades[index] = {id:id,student:student,subject:subject,type:type,value:value,Created: jsondata.grades[index].timestamp, Updated: new Date()}

        
        await writeFile(gradeJson,JSON.stringify(jsondata))
        
    } catch (err) {
        
    }
})

export default router