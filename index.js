const express = require('express');
const app = express();
const port = 8000;


app.listen(port, function(err){
    if(err)
    {
        console.log(`error in firing the server : ${err}`);
        return;
    }
    console.log(`server up and running on port :${port}`);
});