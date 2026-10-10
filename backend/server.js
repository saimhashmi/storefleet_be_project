import server from "./app.js";
import { connectDB, disconnetDB } from "./config/db.js";

const serverStar = server.listen(process.env.PORT, async (err) => {
	if (err) {
		console.log(`server failed with error ${err}`);
	} else {
		await connectDB();
		console.log(
			`server is running at http://localhost:${process.env.PORT}`,
		);
	}
});

// Graceful shutdown: close Mongo connection on Ctrl+C
process.on("SIGINT", async () => {
	await disconnetDB();
	process.exit(0);
});
