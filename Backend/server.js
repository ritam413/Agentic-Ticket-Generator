import {app} from './app.js';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';

dotenv.config()


connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;

        const server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })

        console.log("✅ Connected to MongoDB");

        server.on("error", (err) => {
            console.log("❌ ERROR starting server:", err); 
            throw err ;
        })
    }).catch((err) => {
        console.log("❌ ERROR connecting to MongoDB:", err);
        process.exit(1);
    })

