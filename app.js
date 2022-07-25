const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = 'https://us14.api.mailchimp.com/3.0/lists/9f9927e0b0';
  const options = {
    method: "POST",
    auth: "maxcurky5:60db358741faa6473d8438d6c8a1903d-us14"
  }
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
})

// 60db358741faa6473d8438d6c8a1903d-us14
// 9f9927e0b0
