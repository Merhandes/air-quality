const mqtt = require("mqtt");
const { MongoClient } = require("mongodb");

// --- KONFIGURASI MONGODB ATLAS ---
const mongoUri =
  "mongodb+srv://merhandes20_db_user:JHUcm4EJOsAj7wsG@tes.6jfn4j3.mongodb.net/?appName=tes";
const mongoClient = new MongoClient(mongoUri);

// --- KONFIGURASI HIVEMQ CLOUD ---
const mqttUrl =
  "tls://59b6d88568f542958be34b73fcb80600.s1.eu.hivemq.cloud:8883";
const mqttOptions = {
  username: "roott",
  password: "Root12345",
};

async function startBridge() {
  try {
    await mongoClient.connect();
    console.log("✅ Terhubung ke MongoDB Atlas!");

    const db = mongoClient.db("monitoring_udara");
    const collection = db.collection("logs");

    const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

    mqttClient.on("connect", () => {
      console.log("✅ Terhubung ke HiveMQ Cloud!");
      // Subscribe ke topic yang sama dengan di ESP32
      mqttClient.subscribe("kualitas/udara/sensor1");
    });

    mqttClient.on("message", async (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        data.timestamp = new Date(); // Tambahkan waktu saat data masuk

        await collection.insertOne(data);
        console.log("🚀 Data tersimpan ke Cloud:", data);
      } catch (err) {
        console.log("❌ Format data bukan JSON:", message.toString());
      }
    });
  } catch (err) {
    console.error("❌ Gagal Terhubung:", err);
  }
}

startBridge();
