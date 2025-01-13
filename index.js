import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

// env connect
dotenv.config();
const port = process.env.PORT || 5000;
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

// app create
const app = express();

// middlewares
app.use(express.json());
app.use(
	cors({
		origin: ["https://coffee-shop-client.vercel.app"],
		credentials: true,
	})
);

// app health check
app.get("/", (req, res) => {
	res.send({
		message: "OK",
	});
});

// database configuration
const uri = `mongodb+srv://${username}:${password}@cluster0.yc5i8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		// await client.connect();

		// Get the database and collection on which to run the operation
		const database = client.db("coffeeDB");
		const coffeeCollection = database.collection("coffeeCollection");

		// get all coffees
		app.get("/coffees", async (_req, res) => {
			const result = await coffeeCollection.find().toArray();
			console.log(result);
			res.send(result);
		});

		// get single coffee details
		app.get("/coffees/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };

			const result = await coffeeCollection.findOne(query);
			res.send(result);
		});

		// insert coffee details
		app.post("/coffees", async (req, res) => {
			const coffee = req.body;

			// Insert the defined document into the "haiku" collection
			const result = await coffeeCollection.insertOne(coffee);

			res.send(result);
		});

		// delete coffee
		app.delete("/coffees/:id", async (req, res) => {
			const id = req.params.id;

			const query = { _id: new ObjectId(id) };
			const result = coffeeCollection.deleteOne(query);

			res.send(result);
		});

		// get single coffee
		app.get("/coffees/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await coffeeCollection.findOne(query);

			res.send(result);
		});

		// update coffee
		app.put("/coffees/:id", async (req, res) => {
			const id = req.params.id;
			const newCoffee = req.body;

			const filter = { _id: new ObjectId(id) };

			// Specify the update to set a value for the plot field
			const coffee = {
				$set: {
					company_name: newCoffee.company_name,
					coffee_name: newCoffee.coffee_name,
					chef_name: newCoffee.chef_name,
					supplier_name: newCoffee.supplier_name,
					taste: newCoffee.taste,
					category: newCoffee.category,
					details: newCoffee.details,
					price: newCoffee.price,
					added_by: "hazzazabdul111@gmail.com",
				},
			};

			const result = await coffeeCollection.updateOne(filter, coffee);

			res.send(result);
		});

		// Send a ping to confirm a successful connection
		// await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

// listening port
app.listen(port, () => {
	console.log(`app is listening on PORT: ${port}`);
});
