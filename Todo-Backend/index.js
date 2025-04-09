import express from "express";
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors())

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err)
    );


const todoschmea = new mongoose.Schema({
    title: String,
    description: String


});

const todomodel = mongoose.model('TodosCollection', todoschmea);

app.listen(3001, () => console.log("App is listenning to the Port 3001"));


app.get('/', (req, res) => {
    res.send("Hello 'world");
});




app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    // const newtodo = {
    //     id: todos.length + 1,
    // //     title,
    // //     desc
    // // }
    // // todos.push(newtodo);
    // console.log(todos);
    // console.log(newtodo);
    // res.status(201).json(newtodo);

    try {
        const newTodo = new todomodel({ title, description })
        await newTodo.save();
        res.status(201).json(newTodo);


    } catch (error) {
        console.log(error);
        res.status(500);
    }


});
app.get('/todos', async (req, res) => {
    try {
        const todos = await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

app.put('/todos/:id', async(req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;

        const udpatedtod =await todomodel.findByIdAndUpdate(
            id, { title, description } ,{new:true}
        );
        if (!udpatedtod) { return res.status(404).json({ message: "To Id Not found" }) }
        res.json(udpatedtod);

    } catch (error) {
        console.log(error);

        
    }
})


app.delete('/todos/:id', async(req,res)=>{
    try {
        const id=req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(200).end();
        
    } catch (error) {

        console.log(error);
    }
})