const express = require("express");
const router = express.Router();
const routeControllers = require("../controllers/routeControllers");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("*", checkUser);
router.get("/signup", routeControllers.signup_get);
router.post("/signup", routeControllers.signup_post);
router.get("/login", routeControllers.login_get);
router.post("/login", routeControllers.login_post);
router.get("/dashboard", requireAuth, routeControllers.dashboard);
router.get("/logout", routeControllers.logout_get);

module.exports = router;
