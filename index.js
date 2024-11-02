const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://whatsapp-user1:xwduCwbfAz3OnE8w@machbazar.vecifgc.mongodb.net/?retryWrites=true&w=majority&appName=machbazar";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const conversationCollection = client
      .db("copy_whatsapp_web")
      .collection("conversations");
    const messagesCollection = client
      .db("copy_whatsapp_web")
      .collection("messages");

    app.get("/api/conversations/:userId", async (req, res) => {
      const { userId } = req.params;

      try {
        // Find all conversations where the participants array includes the specified userId
        const conversations = await conversationCollection
          .find({ participants: userId })
          .toArray();

        res.send(conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        res.send({ error: "An error occurred while fetching conversations." });
      }

      app.get("/api/messages/:conversationId", async (req, res) => {
        const { conversationId } = req.params;

        try {
          // Find all messages for the specified conversationId
          const messages = await messagesCollection
            .find({ conversationId })
            .toArray();

          res.send(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
          res.send({ error: "An error occurred while fetching messages." });
        }
      });

      // Server setup code
      app.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("copy whatsapp running here");
});

app.listen(port, () => console.log("copy whatsapp server"));
