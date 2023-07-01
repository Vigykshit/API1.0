let express = require('express');
let app = express();
let port =process.env.PORT|| 9120;
const bodyParser = require('body-parser');
const cors = require('cors');
let {dbConnect,getData,postData,updateOrder,deleteOrder} = require('./controller/dbController')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

app.get('/',(req,res)=>{
    res.send('we are using amazonapi')
})

app.get('/category',async (req,res)=>{
    let querry ={};
    let collection = "category"
    let output = await getData(collection,querry)
    res.send(output)
})


app.get('/item',async (req,res)=>{
    let querry ={};
    if(req.query.categoryId && req.query.filterId ){
        querry={category_id:Number(req.query.categoryId),"Filters.Filter_id":Number(req.query.filterId)}
    }
    else if(req.query.categoryId  ){
        querry={category_id:Number(req.query.categoryId)}
    }
    else if(req.query.productId){
        querry={"Filters.Filter_id":Number(req.query.filterId)}
    }
    else{
        querry={}
    }
    let collection = "item"
    let output = await getData(collection,querry)
    res.send(output)
})


// app.get('/filter/:productId' , async(req,res)=>{
//    let productId= Number(req.param.ProductId);
//    let filterId = Number(req.param.Filter_id)
//    let lcost = Number(res.query.lprice)
//    let hcost = Number(res.query.hprice)
//    if (filterId){
//     query ={
//         "product_id":productId,
//         "Filters.Filter_id":filterId}
//    }

//        else if(lcost && hcost){
//         query = {
//             $and:[{price:{$gte:hcost,$lte:lcost},}]
//         }
//        }
//        else{
//         query={}
//        }
//    let collection = "item"
//     let output = await getData(collection,querry)
//     res.send(output)
// })

app.get('/itemdetail/:id', async(req,res) => {
    let id = new Mongo.ObjectId(req.params.id)
    let query = {_id:id}
    let collection = "itemdetail";
    let output = await getData(collection,query);
    res.send(output)
})
// app.get('/itemdetail',async (req,res)=>{
//     let querry ={};
//     if(req.query.productId  ){
//         querry={product_id:Number(req.query.productId)}
//     }   
//     let collection = "itemdetail"
//     let output = await getData(collection,querry)
//     res.send(output)
// })
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

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})