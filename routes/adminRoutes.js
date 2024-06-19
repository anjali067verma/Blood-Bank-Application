const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDonarsListController,
    getHospitalListController,
    getOrganisationListController,
    deleteDonorController }
    = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");
//router
const router = express.Router();
//ROUTES
//GET  DONARS LIST
router.get("/donar-list",
    authMiddleware,
    adminMiddleware,
    getDonarsListController);
//GET HOSPITAL LIST
router.get("/hospital-list",
    authMiddleware,
    adminMiddleware,
    getHospitalListController);
//GET  ORGANISATION LIST
router.get("/orgn-list",
    authMiddleware,
    adminMiddleware,
    getOrganisationListController);
//GET  || DELETE DONOR
router.delete("/delete-donor/:id",
    authMiddleware,
    adminMiddleware,
    deleteDonorController);
//EXPORT
module.exports = router;