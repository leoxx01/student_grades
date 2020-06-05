import express from "express"
import {promises} from "fs"
import routes from "./routes/routes.js"

const app = express()

global.gradeJson = "grades.json"
const readFile = promises.readFile
const writeFile = promises.writeFile

app.use(express.json())
app.use("/student", routes)

app.listen(3000,async()=>{
    try{
        let teste = await readFile(gradeJson,"utf8")
        console.log("Online")
    }catch(err){
        const jsonInit = {
            nextID: 1,
            grades: []
        }
        writeFile(gradeJson,JSON.stringify(jsonInit)).catch(err=>console.log(err))
    }
})
