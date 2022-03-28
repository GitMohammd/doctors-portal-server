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
    
    app.post("/appointment", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentCollection.insertOne(appointment);
      console.log(result);
      res.json(result)
    });
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
