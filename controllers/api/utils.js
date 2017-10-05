module.exports = {
    jsonRes: (res, data, error) => {
        res.json({
            status: !error ? 'success' : 'error',
            message: !error ? 'ok' : error,
            data: data
        });
    }
};
