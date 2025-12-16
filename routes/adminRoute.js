const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkAdmin = require("../middleware/auth");

router.get("/login", adminController.getLogin);
router.post("/login", adminController.postLogin);
router.get("/logout", adminController.logout);

router.use(checkAdmin);

router.get("/edit-user/:id", checkAdmin, adminController.getEditUserPage);
router.post("/edit-user/:id", checkAdmin, adminController.updateUser);

router.get("/delete-user/:id", checkAdmin, adminController.deleteUser);

router.get("/create-user", checkAdmin, adminController.getCreatePage);
router.post("/create-user", checkAdmin, adminController.createUser);



router.get("/dashboard", adminController.getDashboard);

module.exports = router;




