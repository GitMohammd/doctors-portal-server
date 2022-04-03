const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv");
dotenv.config();


app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8q3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("doctor's_portal");
    const appointmentCollection = database.collection("appointments");
    const userCollection = database.collection("user");

    app.get("/appointments", async(req, res) => {
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleDateString();
      const query = {email: email, date: date};
      const cursor = await appointmentCollection.find(query).toArray();
      res.json(cursor);
      
    })
    
    app.post("/appointment", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentCollection.insertOne(appointment);
      res.json(result)
    });

    app.get("/user", async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      let isAdmin = false;
      const cursor = await userCollection.findOne(query)
      
      if(cursor?.role === 'admin') {
        isAdmin = true;
      }
      res.json(isAdmin);
      // console.log(isAdmin);
    })

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    app.put("/user", async (req, res)=>{
      const user = req.body;
      const email = req.body.email;
      const filter = { email};
      const options = { upsert: true };
      const updateDoc= {$set: user}
      const result = await userCollection.updateOne(filter, updateDoc, options) ;
      res.json(result);
    });


app.put("/user/admin", async (req, res)=>{
    const email = req.body.email;
      const filter = { email };
      const updateDoc = {$set: {role: 'admin'}};
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
