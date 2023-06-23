
const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/TodoDb",{useNewUrlParser:true});
const itemsSchema = {
    name: String
};

const ListSchema = {
    name : String,
    items : [itemsSchema]
}

const Item = mongoose.model("Item",itemsSchema);
const List = mongoose.model("List",ListSchema);
const arr = [
    {
    name : "6am Alarm" 
    },
    {
        name: "Gym"
    },
    {
        name: "Ready Up"
    }

];


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("assets"));


app.get("/",function(req,res) {
    
    // let day = date();

    Item.find({}).then(function(FoundItems){
        if(FoundItems.length===0){
            Item.insertMany(arr);
            res.redirect("/");
        }
        else {
            res.render("list", {listTitle: "Today", newListItems:FoundItems});
        }
      })
       .catch(function(err){
        console.log(err);
      })
});

app.post("/",function(req,res) {
    
    
    let listName = req.body.list;
    let itemName = req.body.newItem;   
    const item = new Item({
        name: itemName
    });
    if(listName === "Today")
    {
        item.save();
    res.redirect("/");
    }
    else
    {
        List.findOne({name:listName}).then(function(foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
});


app.post("/delete",function(req,res){

    const deleteItemId = req.body.delete;
    const listName = req.body.listName;
    if(listName === "Today")
    {
        Item.findByIdAndDelete(deleteItemId).then(function(err){});
        res.redirect("/");
    }
    else
    {
        List.findOneAndUpdate({name:listName , $pull:{items: {_id: deleteItemId}}}).then(function(err){});
        res.redirect("/"+listName);
    }
});

app.get("/:customListName",function(req,res) {
    
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName}).then(function(foundList){
        if(!foundList)
        {
            const list = new List({
                name:customListName,
                items: arr
            });
            list.save();
            res.redirect("/"+ customListName);
        }
        else{
            res.render("list",{listTitle: foundList.name, newListItems:foundList.items})
        }
    })

});

app.listen(3000,function() {
    console.log("Server started listening on port 3000");
});