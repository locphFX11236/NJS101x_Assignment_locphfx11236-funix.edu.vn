exports.get404 = (req, res, next) => {
    res.status(404).render(
        '404', // Đến file 404 theo app.set là 'ejs', 'views'
        { pageTitle: 'Error 404' } // Page Title
    );
};