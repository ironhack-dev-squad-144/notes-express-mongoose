const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const Country = require("../models/Country");

// cRud: Route "GET /" to display all companies
router.get("/", (req, res, next) => {
  let start = new Date();
  Company.find()
    .sort({ name: 1 })
    .limit(1000)
    .then(companiesFromDb => {
      let end = new Date();
      console.log("Diff in ms:", end - start);

      Country.find().then(countriesFromDb => {
        res.render("index", {
          companies: companiesFromDb,
          countries: countriesFromDb
        });
      });
    });
});

// cRud: Route "GET /company/anId" to display the detail
router.get("/company/:companyId", (req, res, next) => {
  let companyId = req.params.companyId;
  Company.findById(companyId)
    .populate("_country") // Replace the ObjectId by the document (for the field "_country")
    .then(company => {
      res.render("company-detail", { company: company });
    });
});

// cruD: Route "GET /delete-company/anId" to delete one company
router.get("/delete-company/:companyId", (req, res, next) => {
  let companyId = req.params.companyId;
  Company.findByIdAndDelete(companyId).then(company => {
    res.redirect("/"); // Go to the page http://localhost:3000/
  });
});

// Crud: Route "GET /add-company" to display a form
router.get("/add-company", (req, res, next) => {
  res.render("add-company");
});

// Crud: Route "POST /add-company" to handle the form submission
router.post("/add-company", (req, res, next) => {
  // Shortcut for: let name = req.body.name; .....
  let { name, number_of_employees, description } = req.body;
  Company.create({ name, number_of_employees, description })
    .then(companyCreated => {
      console.log("The _id of the company created:", companyCreated._id);
      res.redirect("/");
    })
    .catch(err => {
      console.log("An error happened", err);
      res.redirect("/add-company"); // Not perfect: it redirects the user to the form again without any feedback
    });
});

// crUd: Route "GET /edit-company/anId" to display the edit form
router.get("/edit-company/:companyId", (req, res, next) => {
  Company.findById(req.params.companyId).then(company => {
    res.render("edit-company", { company });
  });
});

// crUd: Route "POST /edit-company/anId" to handle the form submission
router.post("/edit-company/:companyId", (req, res, next) => {
  console.log("req.body", req.body);
  let id = req.params.companyId;
  let { name, number_of_employees, description } = req.body;
  Company.findByIdAndUpdate(id, {
    name,
    number_of_employees,
    description
  }).then(() => {
    res.redirect("/company/" + id);
  });
});

// Routes for countries

// // Version 1: we have to wait twice
// router.get("/country/:countryId", (req, res, next) => {
//   let countryId = req.params.countryId;

//   Company.find({ _country: countryId }).then(companies => {
//     Country.findById(countryId).then(country => {
//       res.render("country-detail", { country, companies });
//     })
//   });
// });

// // Version 2 (faster): we have to wait only once
// router.get("/country/:countryId", (req, res, next) => {
//   let countryId = req.params.countryId;

//   // Promise.all takes as a parameter an array of promises
//   Promise.all([
//     Company.find({ _country: countryId }),
//     Country.findById(countryId)
//   ])
//     .then(results => {
//       let companies = results[0];
//       let country = results[1];
//       res.render("country-detail", { country, companies });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// Version 3: same as version 2
router.get("/country/:countryId", (req, res, next) => {
  let countryId = req.params.countryId;

  // Promise.all takes as a parameter an array of promises
  Promise.all([
    Company.find({ _country: countryId }),
    Country.findById(countryId)
  ])
    .then(([companies, country]) => {
      res.render("country-detail", { country, companies });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
