/* Author : Janakiraman Gopinath */
module.exports = function(app, _) {
    // 
    // index.js
    //

    var index = function(req, res) {
        res.render('index', {
            info: {
                'title': 'Index'
            }
        });
    };
    app.get('/', index);
}