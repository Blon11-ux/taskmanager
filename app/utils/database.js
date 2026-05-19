import mongoose from "mongoose"

const connectDB = async () => { 
    try {
        await mongoose.connect("mongodb+srv://251019_db_user:751108@cluster1.qnqsdev.mongodb.net/taskmanagerDatabase?appName=Cluster1")
        console.log("connected to mongoDB");
    } catch (error) {
        console.log("failure to connect");
    }
}
export default connectDB