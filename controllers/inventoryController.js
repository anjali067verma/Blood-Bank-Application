const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
//CREATE INVENTORY
const createInventoryController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User Not Found");
        }
        if (req.body.inventoryType == "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);
            //calculate Blood Quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "in",
                        bloodGroup: requestedBloodGroup,
                    },
                }, {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            // calculate out blood quantity
            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organisation,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;
            //IN AND OUT BLOOD QUANTITY CALCULATION
            const availableQuanityOfBloodGroup = totalIn - totalOut;
            //QUANTITY VALIDATION
            if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuanityOfBloodGroup}ml of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "New Blood Record Added",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Create Inventory API",
            error,
        });
    }
};
//GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({ organisation: req.body.userId, })
            .populate("donar")
            .populate("hospital")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Get all records successfully",
            inventory,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Get All Inventory",
            error,
        });
    }
};
//Get Hospital Blood Records
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find(req.body.filters)
            .populate("donar")
            .populate("hospital")
            .populate("organisation")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Get hospital consumer records successfully",
            inventory,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Get Consumer Inventory",
            error,
        });
    }
};
// GET BLOOD RECORDS OF 5
const getRecentInventoryController = async (req, res) => {
    try {

        const inventory = await inventoryModel.find({
            organisation: req.body.userId
        })
            .limit(5)
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Recent Inventory Data",
            inventory,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Recent Inventory API",
            error,
        });
    }
};

// GET DONOR RECORDS
const getDonarsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //find Donors
        const donorId = await inventoryModel.distinct("donar", {
            organisation,
        });
        const donars = await userModel.find({ _id: { $in: donorId } });
        return res.status(200).send({
            success: true,
            message: "Donor Record Fetched Successfully",
            donars,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in Get Donor records",
            error,
        });
    }
};
// GET HOSPITALS RECORDS
const getHospitalsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //GET HOSPITAL ID
        const hospitalId = await inventoryModel.distinct("hospital", { organisation });
        //FIND HOSPITAL
        const hospitals = await userModel.find({
            _id: { $in: hospitalId }
        });
        return res.status(200).send({
            success: true,
            message: 'Hospital Data Fetched Successfully',
            hospitals,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error In Get Hospital API',
            error,
        });
    }
};
// GET ORGANISATION RECORDS
const getOrganisationController = async (req, res) => {
    try {
        const donar = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation", { donar });
        //find organisation
        const organisations = await userModel.find({
            _id: { $in: orgId }
        });
        return res.status(200).send({
            success: true,
            message: "Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Organisation API",
            error,
        });
    }
};
//GET ORGANISATION FOR HOSPITAL
const getOrganisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation", { hospital });
        //find organisation
        const organisations = await userModel.find({
            _id: { $in: orgId }
        });
        return res.status(200).send({
            success: true,
            message: "Hospital Org Data Fetched Successfully",
            organisations,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error In Hospital Organisation API',
            error,
        });
    }
};
module.exports = {
    createInventoryController,
    getInventoryController,
    getDonarsController,
    getHospitalsController,
    getOrganisationController,
    getOrganisationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController
};