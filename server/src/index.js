import connectDB from "./clients/mongo_client.js";
import dotenv from "dotenv";
import server from "./server.js";

dotenv.config();
connectDB()
  .then(async () => {
    console.log("db connected:");
     server.listen(process.env.PORT || 3000, "0.0.0.0", () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
    
  }) 
  .catch((error) => {
    console.log("MONGODB connection failed! ", error);
  });
 
   