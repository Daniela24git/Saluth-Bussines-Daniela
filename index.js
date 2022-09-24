const app = require("./app");
require("../config/db.config");
const { PORT } = require("../config/env.config");

app.listen(PORT, () => {
  setTimeout(() => {
    console.log(
      `Server running on port ${PORT}, in ${app.get(
        "env"
      )} mode, you can access it at http://localhost:${PORT}/api/auth/signin.`
    );
    console.log("");
  }, 200);
});
