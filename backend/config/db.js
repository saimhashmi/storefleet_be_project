import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log("db connecting...");
		const res = await mongoose.connect(process.env.mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`mongodb connected with server ${res.connection.host}`);
	} catch (error) {
		console.log("mongodb connection failed!");
		console.log(error);
	}
};

export const disconnetDB = async () => {
	try {
		if (mongoose.connection.readyState !== 0) {
			await mongoose.connection.close();
			console.log("MongoDB connection closed");
		} else {
			console.warn(
				"Mongoose connection already closed or not established",
			);
		}
	} catch (error) {
		console.log("mongodb disconnect failed!");
		console.log(error);
	}
};
