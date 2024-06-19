const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createInventoryController,
    getInventoryController,
    getDonarsController,
    getHospitalsController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController
} = require("../controllers/inventoryController");
const router = express.Router();
//routes
//ADD INVENTORY || POST
router.post("/create-inventory", authMiddleware, createInventoryController);
//GET ALL BLOOD RECORD
router.get("/get-inventory", authMiddleware, getInventoryController);
//GET RECENT BLOOD RECORDs
router.get("/get-recent-inventory", authMiddleware, getRecentInventoryController);
//GET HOSPITAL BLOOD RECORD
router.post("/get-inventory-hospital", authMiddleware, getInventoryHospitalController);
//GET DONOR RECORD
router.get("/get-donor", authMiddleware, getDonarsController);
//GET HOSPITAL RECORD
router.get("/get-hospital", authMiddleware, getHospitalsController);
//GET ORGANISATION RECORD
router.get("/get-organisation", authMiddleware, getOrganisationController);
//GET ORGANISATION FOR HOSPITAL RECORD
router.get("/get-organisation-for-hospital", authMiddleware, getOrganisationForHospitalController);
module.exports = router;
