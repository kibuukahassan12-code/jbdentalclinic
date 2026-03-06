const path=require('path');
import './server/index.js';
app.use(express.static(path.join(__dirname,'dist')));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'dist','index.html')));

const path=require("path");
app.use(express.static(path.join(__dirname,"dist")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"dist","index.html")));
