const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zroauvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  

    const touristCollection = client.db('touristdb').collection('tourist');
    const countryCollection = client.db('touristdb').collection('country');

    app.get("/country", async(req, res) => {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get("/touristSpot", async(req, res) => {
        const cursor = touristCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get("/touristSpot/:id", async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await touristCollection.findOne(query);
        res.send(result)
    })

    app.post("/touristSpot", async(req, res) => {
        const newAdd = req.body;
        console.log(newAdd)
        const result = await touristCollection.insertOne(newAdd);
        res.send(result)   
    })
    app.put("/touristSpot/:id", async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedTourist = req.body;
        const Tourist = {
            $set:{
                image: updatedTourist.image,
                tourists_spot_name: updatedTourist.tourists_spot_name,
                country_Name: updatedTourist.country_Name,
                location: updatedTourist.location,
                short_description: updatedTourist.short_description,
                average_cost: updatedTourist.average_cost,
                seasonality: updatedTourist.seasonality,
                travel_time: updatedTourist.travel_time,
                totalVisitorsPerYear: updatedTourist.totalVisitorsPerYear,
                email: updatedTourist.email,
                name: updatedTourist.name
            }
        }
        const result = await touristCollection.updateOne(filter, Tourist, options);
        res.send(result)
    })
    app.delete("/touristSpot/:id", async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await touristCollection.deleteOne(query);
        res.send(result)
    })
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send('server running')
})

app.listen(port, () =>{
    console.log(`server running on port: ${port}`)
})