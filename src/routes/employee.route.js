import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addEmployees, deleteSingleEmployee, getEmployees, getSingleEmployee, updateSingleEmployee } from "../controllers/employes.controller.js"

const router = Router();

// secured routes
router.route("/add-employee").post(verifyJWT, upload.fields([{name:"avatar", maxCount:1}]), addEmployees);
router.route("/get-employees").get(verifyJWT, getEmployees)
router.route("/get-profile/:id").get(verifyJWT, getSingleEmployee)
router.route("/update-profile").patch(verifyJWT, upload.single("avatar"), updateSingleEmployee)
router.route("/delete-profile/:id").delete(verifyJWT, deleteSingleEmployee)

export default router;