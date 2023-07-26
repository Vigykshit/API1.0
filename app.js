let express = require('express');
let app = express();
let port =process.env.PORT|| 9120;
let Mongo = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
let {dbConnect,getData,postData,updateOrder,deleteOrder} = require('./Controller/dbControler')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())


app.get('/',(req,res)=>{
    res.send('we are using amazonapi')
})

app.get('/category',async (req,res)=>{
    let query ={};
    let collection = "category"
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/category/:id', async(req,res) => {
    let id = Number(req.params.id)
    let query = {category_id:id}
    let collection = "item";
    let output = await getData(collection,query);
    res.send(output)
})



app.get('/item',async (req,res)=>{
    let query ={};
    if(req.query.categoryId && req.query.productId ){
        query={category_id:Number(req.query.categoryId),"product_id":Number(req.query.productId)}
    }
    else if(req.query.categoryId  ){
        query={category_id:Number(req.query.categoryId)}
    }
    else if(req.query.productId){
        query={product_id:Number(req.query.productId)}
    }
    else{
        query={}
    }
    let collection = "item"
    let output = await getData(collection,query)
    res.send(output)
})

// app.get('/categoryId/:id', async(req,res) => {
//     let id = Number(req.params.product_id)
//     let query = {product_id:id}
//     let collection = "item";
//     let output = await getData(collection,query);
//     res.send(output)
// })

//filter api
// app.get('/category', async (req,res) => {
//     let query = {};
//     let collection = "category";
//     let output = await getData(collection,query);
//     res.send(output)
// })

app.get('/item',async (req,res)=>{
    let query ={};
    if(req.query.categoryId && req.query.filterId ){
        query={category_id: Number(req.query.categoryId),"Filters.Filter_id": Number(req.query.filterId)}
    }
    else if(req.query.categoryId){
        query={category_id: Number(req.query.categoryId)}
    }
    else if(req.query.filterId){
        query={"Filters.Filter_id": Number(req.query.filterId)}
    }
    
    else{
        query={}
    }
    let collection = "item"
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/filter/:categoryId' , async(req,res)=>{
   let categoryId= Number(req.params.categoryId);
   let filterId = Number(req.query.filterId)
   let lcost= Number(req.query.lcost)
   let hcost = Number(req.query.hcost)
   if (filterId){
    query ={
        category_id: categoryId,
        "Filters.Filter_id": filterId
    }
   }

   else if(lcost && hcost){
    query = {
        category_id: categoryId,
        $and:[{cost:{$gt:lcost,$lt:hcost}}]
    }
}
       else{
        query={}
       }
    let collection = "item";
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/itemdetail/:id', async(req,res) => {
    let id = new Mongo.ObjectId(req.params.id)
    let query = {_id:id}
    let collection = "itemdetail";
    let output = await getData(collection,query);
    res.send(output)
})
// app.get('/itemdetail',async (req,res)=>{
//     let query ={};
//     if(req.query._id ){
//         query={_id:Number(req.query._id)}
//     }
//     else{
//         query={}
//     }
//     let collection = "itemdetail";
//     let output = await getData(collection,query);
//     res.send(output)
// })
// app.get('/item/:id', async(req,res) => {
//     let id = Number(req.params.id)
//     let query = {category_id:id}
//     let collection = "item";
//     let output = await getData(collection,query);
//     res.send(output)
// })

app.get('/itemdetail',async (req,res)=>{
    let query ={};
    if(req.query.productId ){
        query={product_id:Number(req.query.productId)}
    }
    else{
        query={}
    }
    let collection = "itemdetail";
    let output = await getData(collection,query);
    res.send(output)
})



// app.get('/itemdetail',async (req,res)=>{
//     let query ={};
//     if(req.query.productId  ){
//         query={product_id:Number(req.query.productId)}
//     }   
//     let collection = "itemdetail"
//     let output = await getData(collection,query)
//     res.send(output)
// })

app.get('/menu',async (req,res)=>{
    let query ={};
    let collection = "menu"
    let output = await getData(collection,query)
    res.send(output)
})
app.get('/menu/:id',async(req,res) => {
let id = Number(req.params.id)
let query ={menu_id:id}
let collection ='menu';
let output =await getData(collection,query)
res.send(output)
})
app.get('/orders',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})
app.post('/menuDetails', async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query ={menu_id:{$in:req.body.id}};
        let collection = "menu";
    let output = await getData(collection,query);
    res.send(output)
    }else{
        res.send('Please Pass Data in form of array')
    }   
})

app.put('/updateOrder',async(req,res) => {
    let collection ="orders";
    let condition ={"_id":new Mongo.ObjectId(req.body._id)}
    let data ={
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})




app.listen(port,(err)=>{
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})