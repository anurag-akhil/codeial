
const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        console.log("###########", env.name);
        if (env.name == 'devlopment'){
            console.log("***************   devlopment mode called with file path",filePath);
            return filePath;
        }
        //console.log("****************  production mode called with file path", filePath, "  ",JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath]);
        
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}