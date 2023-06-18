import mongoose from "mongoose";

const connectionDB = async () => {
    // mongodb://localhost:27017
    return await mongoose
        .connect("mongodb+srv://EcommerceFurniture:shabanhamdy@cluster0.e09gpvw.mongodb.net/EcommerceFurniture")
        .then(res => console.log("connection DB is Running"))
        .catch(err => console.log({ message: "fail in connection DB", err }))

}

export default connectionDB