var express = require("express");
var router = express.Router();
var passport = require("passport");
const AWS = require("aws-sdk");

const ID = "AKIAIBWPTYOYJ2QRK36A";
const SEGREDO = "u0mf3sZpV0vbFaoW2dosStCWLUMi1X6VIY1NNScX";
const BUCKET_NAME = "puc-trabalho-final";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SEGREDO
});

var bucketParams = {
  Bucket: BUCKET_NAME
};

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/admin");
  }
);

router.get("/file/", (req, res) => {
  res.render("add", {
    user: req.session.passport.user,
    viewTitle: "Inserir Arquivo"
  });
});

router.post("/file/", (req, res) => {
  insertRecord(req, res);
});

function insertRecord(req, res) {
  uploadFile(req.body.fullPath);
  res.redirect("admin");
}

function uploadFile(fileName) {
  const fileContent = fs.readFileSync(fileName);
  var name = path.basename(fileName);

  const params = {
    Bucket: BUCKET_NAME,
    Key: name,
    Body: fileContent
  };

  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`Arquivo enviado com sucesso. ${data.Location}`);
  });
}

router.get("/file/delete/:name", (req, res) => {
  deletar(name);
  res.redirect("admin");
});

function deletar(fileName) {
  s3.deleteObject(
    {
      Bucket: BUCKET_NAME,
      Key: fileName
    },
    function(err, data) {
      if (err) {
        throw err;
      }
    }
  );
}

router.get("/file/list", (req, res) => {
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      var arquivos = new Array();
      for (var i = 0; i < data.Contents.length; i++) {
        var obj = data.Contents[i];
        arquivos[i] = obj.Key;
      }
      console.log("Listar arquivos");
      console.log(arquivos);
      res.render("admin", { user: req.session.passport.user, list: arquivos });
    }
  });
});

module.exports = router;
