import express from "express"
import fileupload from "express-fileupload"
import cors from "cors"




const app  =express()

app.use(express.urlencoded())
app.use(express.json())
app.use(cors())
app.use(fileupload())

app.post("/file", async (req,res) => {
    try {
        
        res.json({files: req.files.file})
    } catch (error) {
        
    }
})


app.listen(5000, ()=>{
    console.log("Server is running on 5000")
})