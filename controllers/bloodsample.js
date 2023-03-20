const { Samples } = require("../models/users");
const jwt = require("jsonwebtoken");
const SECRETKEY = "JWTSECRET";

module.exports.AllSamples = async (req, res) => {
  try {
    const bloodSamples = await Samples.find({});
    if (bloodSamples) {
      res.send(bloodSamples);
    } else {
      res.send("No blood samples found");
    }
  } catch (error) {}
};

module.exports.ListHospitalSamples = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, SECRETKEY);
      if (decoded.role === "hospital") {
        const HospitalSample = await Samples.find({
          Hospital: decoded.username,
        });
        console.log(HospitalSample);
        res.send(HospitalSample);
      } else {
        res.send("you dont have permission");
      }
    } else {
      res.send("you need to login");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.addBloodSamples = async (req, res) => {
  try {
    const { type } = req.body;
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, SECRETKEY);
      if (decoded.role === "hospital") {
        const sample = new Samples({
          Hospital: decoded.username,
          bloodType: type,
        });
        await sample.save();
        res.send("sample added");
      } else {
        res.send("you dont have permission");
      }
    } else {
      res.send("you need to login");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.editBloodSamples = async (req, res) => {
  try {
    const { type } = req.body;
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, SECRETKEY);
      if (decoded.role === "hospital") {
        const sampleBlood = await Samples.findOne({ _id: req.params.id });
        if (sampleBlood.Hospital === decoded.username) {
          const updatedSample = await Samples.findByIdAndUpdate(req.params.id, {
            bloodType: type,
          });
          res.send("sample updated");
        } else {
          res.send("not your blood sample");
        }
      } else {
        res.send("you dont have permission");
      }
    } else {
      res.send("you need to login");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.deleteBloodSamples = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, SECRETKEY);
      if (decoded.role === "hospital") {
        const sampleBlood = await Samples.findOne({ _id: req.params.id });
        if (sampleBlood.Hospital === decoded.username) {
          const deletedSample = await Samples.deleteOne({ _id: req.params.id });
          res.send("sample deleted");
        } else {
          res.send("not your blood sample");
        }
      } else {
        res.send("you dont have permission");
      }
    } else {
      res.send("you need to login");
    }
  } catch (error) {
    console.error(error);
  }
};
