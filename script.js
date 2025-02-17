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

app.get('/edit/:filename',(req,res)=>{
    res.render('edit',{filename:req.params.filename})
})


app.get('/tasks/:filename',(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,filedata)=>{
        res.render('show',{filename:req.params.filename,filedata:filedata})
    })
    
})

app.post('/edit', (req, res) => {
    const action = req.body.action;  // This will be either 'update' or 'delete'
    const previousName = req.body.previousName;
    const newName = req.body.newName;

    if (action === 'update') {
        // Handle file renaming (update name)
        fs.rename(`./files/${previousName}`, `./files/${newName}`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error renaming file");
            }
            res.redirect('/tasks');
        });
    } else if (action === 'delete') {
        // Handle file deletion
        fs.unlink(`./files/${previousName}`, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error deleting file");
            }
            res.redirect('/tasks');
        });
    } else {
        res.status(400).send("Invalid action");
    }
});



app.listen(3000,()=>{
    console.log("Listening on Port 3000")
})
