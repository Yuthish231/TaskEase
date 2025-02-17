const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use('/files', express.static(path.join(__dirname, 'files')));
app.set('view engine','ejs')


app.get('/tasks',(req,res)=>{
    fs.readdir('./files',(err,files)=>{
        res.render("index",{files:files}) // i can also send data to ejs via {files(can be anuything): files}
    })
    
})

app.post('/tasks', (req, res) => {
    console.log(req.body);
    const fileName = `./files/${req.body.title.split(' ').join('')}.txt`;
    const fileContent = req.body.description;

    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error saving file");
        }
        res.redirect('/tasks'); // Redirect to refresh the list
    });
});

app.get('/tasks/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
        res.render('show',{filename:req.params.filename,filedata:filedata})
    })
    
})



app.listen(3000,()=>{
    console.log("Listening on Port 3000")
})
