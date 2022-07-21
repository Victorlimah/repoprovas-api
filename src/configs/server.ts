import app from "./../index.js";

import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const port = +process.env.PORT || 4000;

app.listen(port, () => {
  console.log(chalk.green(`Server started on port ${port}`));
});
