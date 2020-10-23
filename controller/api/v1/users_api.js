const User = require('../../../models/users');
const jwt = require('jsonwebtoken');


module.exports.create_session = async function(req, res){
    try{
    let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password)
        {
            return res.status(422).json({
                message: "invalid username or password"
            });
        }
        return res.status(200).json({
            message: "sign in successfull",
            data:{
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '1000000'})
            }
        });

    }catch(err){
        if(err){console.log('error in user api', err);}
        return res.status(500).json({
            message: 'internal server error'
        });
    }
};