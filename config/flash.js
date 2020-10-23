module.exports.setFlash = function(req, res, next){
    console.log("called", req.flash);
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}   