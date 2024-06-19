const userModel = require("../models/userModel");
//Get Donar List
const getDonarsListController = async (req, res) => {
    try {
        const donarData = await userModel
            .find({ role: "donar" })
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: donarData.length,
            message: "Donar List Fetched Successfully",
            donarData,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Donar List API",
            error,
        });
    }
};
//Get Hospital List
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel
            .find({ role: "hospital" })
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: hospitalData.length,
            message: "Hospital List Fetched Successfully",
            hospitalData,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Hospital List API",
            error,
        });
    }
};
//Get Organisation List
const getOrganisationListController = async (req, res) => {
    try {
        const orgData = await userModel
            .find({ role: "organisation" })
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: orgData.length,
            message: "Organisation List Fetched Successfully",
            orgData,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error In Organisation List API",
            error,
        });
    }
};
//DELETE RECORDS
const deleteDonorController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Record Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error while deleting record',
            error,
        });
    }
};
//EXPORT
module.exports = {
    getDonarsListController,
    getHospitalListController,
    getOrganisationListController,
    deleteDonorController,
};