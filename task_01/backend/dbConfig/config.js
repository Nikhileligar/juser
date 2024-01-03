import mongoose from 'mongoose';

export async function dbConfig() {
    try {
        const dbName = "User_auth";
        mongoose.connect(`mongodb+srv://newUser:newUser@cluster01.swn9b4m.mongodb.net/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        const connection = mongoose.connection;
        console.log("mongo connection")

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }
}
