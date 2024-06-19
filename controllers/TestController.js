const TestController = (req, res) => {
    res.status(200).send({
        message: "Welocome user",
        success: true,
    });
};
module.exports = { TestController };