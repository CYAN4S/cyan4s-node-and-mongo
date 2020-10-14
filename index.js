const http = require("http");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const hostname = "127.0.0.1";
const port = 3000;

const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASS;
const mongoDbName = process.env.MONGODB_NAME;
const mongoCollection = process.env.MONGODB_COLL;
const uri = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.gzm8x.gcp.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`;

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

run();

async function run() {
  await client.connect();

  await createOne({ postTime: new Date(), content: "CREATE WORK" });
  await readOne();
  await updateOne();
  await deleteOne({ content: "wazzzzup" });

  await client.close();
}

async function readOne() {
  try {
    const collection = client.db().collection(mongoCollection);
    const query = {};
    const options = {};
    const output = await collection.findOne(query, options);
    console.log(output);
  } catch (error) {
    console.log(error);
  }
}

async function createOne(input) {
  try {
    const collection = client.db().collection(mongoCollection);
    const result = await collection.insertOne(input);
    console.log(`Inserted with the id ${result.insertedId}`);
  } catch (error) {
    console.log(error);
  }
}

async function updateOne() {
  try {
    const collection = client.db().collection(mongoCollection);
    const filter = { content: "CREATE WORK" };
    const options = {};
    const updateDoc = { $set: { content: "wazzzzup" } };
    const result = await collection.updateOne(filter, updateDoc, options);
    console.log(`Updated ${result.modifiedCount}`);
  } catch (error) {
    console.log(error);
  }
}

async function deleteOne(input) {
  try {
    const collection = client.db().collection(mongoCollection);
    const result = await collection.deleteOne(input);
    console.log(`${result.deletedCount} doc(s) deleted.`);
  } catch (error) {
    console.log(error);
  }
}
