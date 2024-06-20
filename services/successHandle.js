const successHandle = (res, data) => {
    res.status(200).json({
        status: true,
        data
    });
}

module.exports = successHandle;