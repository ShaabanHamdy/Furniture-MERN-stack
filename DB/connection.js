import mongoose from "mongoose";

const connectionDB = async () => {
    // mongodb://localhost:27017
    return await mongoose
        .connect(process.env.CONNECTION_ONLINE)
        .then(res => console.log("connection DB is Running"))
        .catch(err => console.log({ message: "fail in connection DB", err }))

}

export default connectionDB