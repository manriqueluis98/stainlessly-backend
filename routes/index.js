const router = require("express").Router();

router.get("/test", (req, res) => {
  res.json("Hello this server is working...");
});

module.exports = router;
