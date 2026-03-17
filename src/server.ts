import app from './app'
import connectDB from './config/database';
import { PORT } from "./config/env"

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});