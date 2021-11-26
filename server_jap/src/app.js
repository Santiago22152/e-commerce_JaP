const express = require ('express');
const fs = require('fs');
const helmet = require("helmet");
var cors = require('cors');

const PORT = 3000;
const indexRoute = require('../routes/index')
// middlewares
const app = express ();

app.use(cors());
app.use(helmet());

// routes
app.use(indexRoute);


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/info', function(request, response){
    console.log(request.body);

    var sell_info = JSON.stringify(request.body);
    var doc = fs.createWriteStream("./sells/sellInfo.txt");
    doc.once('open', function(fd) {
      doc.write(sell_info);
      doc.end();
    });
});

//listening the server
app.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}`)
})

