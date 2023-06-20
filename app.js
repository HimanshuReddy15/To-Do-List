
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();

let items = ["7am alarm","GYM","Freshup"];
let workListItems = ["WebDev"];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("assests"));

app.get("/",function(req,res) {
    
    let day = date();
    res.render("list",{listTitle:day,newListItems:items});
});

app.post("/",function(req,res) {
    
    let item = req.body.newItem;     
    if (req.body.list === "Work") 
    {
        workListItems.push(item); 
        res.redirect("/work");
    }
    else
    {
        items.push(item);
        res.redirect("/");  
    }
});

app.get("/work",function(req,res) {
    res.render("list",{listTitle:"Work List", newListItems: workListItems}); 
});

app.get("/about",function (req,res) {
    res.render("about")
})
app.listen(3000,function() {
    console.log("Server started listening on port 3000");
});