const bcrypt = require("bcrypt");
//const User = require('../models/user.js');
const jwt = require("jsonwebtoken");
const models = require("../models");
let verifInput = require("../utils/verifInputs");
const e = require("express");
const fs = require("fs");

var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  password = "aes-256-ctr";

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

exports.signup = (req, res, next) => {
  // Valider les paramètres de la requète
  let email = encrypt(req.body.email);
  let username = req.body.username;
  let password = req.body.password;

  if (email == null || username == null || password == null) {
    res.status(400).json({ error: "il manque un paramètre" });
  }

  //TO DO => Vérification des saisies user
  let emailOk = verifInput.validEmail(req.body.email);
  console.log("verif email " + emailOk);
  let mdpOK = verifInput.validPassword(password);
  console.log("verif mdp " + mdpOK);
  let usernameOk = verifInput.validUsername(username);
  console.log("verif username " + usernameOk);
  if (emailOk == true && mdpOK == true && usernameOk == true) {
    //Vérification si user n'existe pas déjà
    models.User.findOne({
      attributes: ["username"],
      where: { username: username },
    })
      .then(() => {
        models.User.findOne({
          attributes: ["email"],
          where: { email: email },
        });
      })
      .catch((error) => {
        res.status(409).json({ error: "email" });
      })
      .then((user) => {
        if (!user) {
          bcrypt
            .hash(password, 10)
            .then((hash) => {
              let newUser = models.User.create({
                username: req.body.username,
                email: email,
                password: hash,
                isAdmin: false,
              })
                .then((newUser) => {
                  res
                    .status(201)
                    .json({ "Utilisateur crée ! id : ": newUser.id });
                })
                .catch((error) => {
                  res.status(409).json({ error: "test pour voir sinon" });
                });
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        } else {
          res.status(409).json({ error: "Cette utilisateur existe déjà" });
        }
      })
      .catch((error) => {
        res.status(409).json({ error: "test pour voir si " });
      });
  } else {
    console.log("la condition n'est pas remplis :Kappa");
  }
};
exports.login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username == null || password == null) {
    res.status(400).json({ error: "Le document n'est pas complet" });
  }
  models.User.findOne({
    where: { username },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(403).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            uuid: user.uuid,
            email: decrypt(user.email),
            isAdmin: user.isAdmin,
            username: user.username,
            token: jwt.sign({ uuid: user.uuid }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//obtenir le profil d'un utilisateur
exports.userProfil = (req, res, next) => {
  let username = req.body.username;
  models.User.findOne({
    attributes: ["username"],
    where: { username: username },
  })
    .then((User) => res.status(200).json(User))
    .catch((error) => res.status(500).json(error));
};

//supprimer le profil
exports.deleteProfile = (req, res, next) => {
  let userIsAdmin = req.body.userIsAdmin;
  let uuid = req.body.deleteUserUuid;
  console.log("je suis dans deleteprofile");
  models.User.findOne({
    where: { uuid },
  })
    .then((user) => {
      console.log("test " + user);
      if (user != null && (user.uuid == uuid || userIsAdmin == 1)) {
        let uuid = user.uuid;
        models.User.destroy({ where: { uuid } })
          .catch((err) => console.log(err))
          .then(() => res.end());
      } else {
        res.status(401).json({ error: "Cet user n'existe pas" });
      }
    })
    .catch((err) => res.status(404).json(err));
};

//changer le password
exports.changePwd = (req, res, next) => {
  let uuid = req.params.uuid;
  const newPassword = req.body.newPassword;
  console.log("voici le nouveau Mdp : " + newPassword);
  console.log(
    "admin vérifions si validPassword est juste : " +
      verifInput.validPassword(newPassword)
  );
  if (verifInput.validPassword(newPassword)) {
    models.User.findOne({
      where: { uuid },
    })
      .then((user) => {
        if (user) {
          console.log("user trouvé", user);
          bcrypt
            .hash(newPassword, 10)
            .then((hash) => {
              console.log("c'est le hash : " + hash);
              models.User.update({ password: hash }, { where: { uuid: uuid } });
            })
            .then(() =>
              res
                .status(201)
                .json({ confirmation: "mot de passe modifié avec succès" })
            )
            .catch((err) => res.status(500).json(err));
        } else res.status(404).json({ error: "Utilisateur inconnue" });
      })
      .catch((err) => res.status(500).json(err));
  } else {
    res.status(406).json({ error: "mot de passe non valide" });
  }
};

exports.getAll = (req, res, next) => {
  let uuid = req.params.uuid;

  models.User.findOne({
    where: { uuid },
  }).then((user) => {
    if (user.isAdmin == 1) {
      models.User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(500).json(err));
    } else {
      res.status(403).json({ error: "Vous n'êtes pas Admin" });
    }
  });
};
