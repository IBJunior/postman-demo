const users = [
  { id: 1, username: "ali" },
  { id: 2, username: "iali" },
  { id: 3, username: "admin" },
];

// you would normally use something like passport with the JWT Strategy
// this is one is just for the tutorial purposes
const checkToken = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.toLowerCase().includes("bearer")
      ? req.headers.authorization.toLowerCase().replace("bearer", "").trim()
      : null;

    const user = token
      ? users.find((user) => user.username === token.replace("your token ", ""))
      : null;

    if (user) {
      next();
    } else res.status(401).send({ message: "You are not allowed" });
  } else res.status(401).send({ message: "You are not allowed" });
};

module.exports = { checkToken };
