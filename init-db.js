const { MongoClient } = require('mongodb');

async function createDatabase() {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("testVulnerabilities");
    const usersCollection = db.collection("users");

    // Elimina la colección si ya existe
    await usersCollection.drop().catch(() => {});

    // Inserta datos de ejemplo con el campo "role"
    await usersCollection.insertMany([
      { name: "Alice", age: 25, email: "alice@example.com", role: "cliente" },
      { name: "Bob", age: 30, email: "bob@example.com", role: "visitante" },
      { name: "Charlie", age: 35, email: "charlie@example.com", role: "admin" },
      { name: "Pedro", age: 60, email: "pedro@example.com", role: "visitante" }
    ]);

    console.log("Base de datos y datos de ejemplo creados exitosamente.");
  } finally {
    await client.close();
  }
}

createDatabase().catch(console.error);
//npm install express mongodb body-parser validator
