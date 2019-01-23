require('dotenv').config()
const knex = require("knex");
const dbconfig = require("../knexfile");
// need helper to get all skills
const db = require('../helpers/index.js')
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const stripe = require("stripe")(process.env.STRIPE_TEST);

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

aws.config.update({
  secretAccessKey: process.env.AWS_PIC_SECRET_KEY,
  accessKeyId: process.env.AWS_PIC_ACCESS_KEY,
  region: 'us-east-2'
});

const s3 = new aws.S3();


const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'dev-profile-user-profile-images',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

const singleImageUpload = upload.single('image');

// single image upload request
server.post('/image-upload', (req, res) => {
  console.log(req.body)
  singleImageUpload(req, res, function(err) {
    if (err) {
      return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
    }
    return res.json({'imgUrl': req.file.location})
  });
});

// google key, need to move to .env
const key = process.env.GOOGLE_AUTO_COMPLETE

server.post('/location', (req, res) => {

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.body.inputLocation}&key=${key}`;

  axios.post(url)
  .then(response => {
    console.log(response.data)
    res.send(response.data) // <= send data to the client
  })
  .catch(err => {
    console.log(err)
    res.send({ err }) // <= send error
  })
});

// Each place has an ID, you can grab the ID from the Autocomplete, and just put an array of IDs of the origins to 
// calculate distances, instead of having to put gio codes or text addresses
// split array with |

server.post('/matrix', (req, res) => {

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY|Los+Angeles,CA&key=${key}`;

  axios.post(url)
  .then(response => {
    console.log(response.data)
    res.send(response.data) // <= send data to the client
  })
  .catch(err => {
    console.log(err)
    res.send({ err }) // <= send error
  })
});

//need to also save acclaim badge url from user input to new slot on table-- to be added
server.put("/acclaim/:id", (req, res) => {
    //use later to add the acclaim image to the db
    let id = req.params.id
    console.log(req.body)
    axios.get(`https://api.youracclaim.com/v1/obi/badge_assertions/${req.body.badge}`).then(response => {
        db.user_helpers.editUser(id, {badge: response.data.image}).then(data => {
          console.log(data)
        res.status(200).json(data)
        })
    }).catch(err => {
    console.log(err);
    res.send({ err });
    });
});


server.post('/billing', (req, res) => {
  const { stripeToken } = req.body;
  console.log(stripeToken)

  const charge = stripe.charges.create({
    amount: 999,
    currency: 'usd',
    description: 'Example charge',
    source: stripeToken,
  }).then(charge => res.send(charge)).catch(err => console.log(err));
});


// Will not need this
server.post('/skills', (req, res) => {
  // dbHelper.skills_helpers.getAllSkills()
  //   .then(res => {

  //     console.log(res.data)
  //   })
  //   .catch(err => console.log(err))

  // let filteredPosts = this.props.skills(skill => {
  //   return (
  //     skill.name
  //       .toLocaleLowerCase()
  //       .includes(e.target.value)
  // });

  console.log(req.body.skillInput) // <- filter input
  const skills = ['one','two','three']; // <- package into arr
  res.send(skills) // <= send arr to the client
});

module.exports = server 
