const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const emailSender = require('../controllers/email.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');
const templateEmail = require('../config/templateEmails');
const User = require('../models/user.model');

const router = express.Router();
module.exports = router;

router.post('/register', asyncHandler(register), login);
router.post('/forgotPassword', asyncHandler(forgotPassword));
router.post('/resetPassword', asyncHandler(resetPassword));
router.post('/login', passport.authenticate('local', { session: false }), login);
router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.get('/refresh', passport.authenticate('jwt', { session: false }), refresh);


async function register(req, res, next) {
  if (req.body.document && await userCtrl.checkDocumentDup(req.body.document)) {
    return res.status(500).send({ message: "cpf duplicado" });
  } else {
    let user = await userCtrl.insert(req.body);
    delete user.hashedPassword;
    emailSender.sendMail(user.email, 'Inscrição Realizada com Sucesso', templateEmail.inscricaoSucesso);
    req.user = user;
    next()
  }
}

async function forgotPassword(req, res) {

  let user = await User.findOne({ email: req.body.email, document: req.body.document });

  if (!user) {
    return res.status(400).send({ message: "Usuário inválido" });
  }

  let response = await userCtrl.generateNewPassword(user);

  return res.status(response.status).send({ message: response.message });
}


async function resetPassword(req, res) {

  let user = await User.findOne({ mailCodePassword: req.body.mailCodePassword });

  if (!user) {
    return res.status(400).send({ message: "Código inválido" });
  }

  let response = await userCtrl.resetPassword(req, user);

  return res.status(response.status).send({ message: response.message });
}

async function refresh(req, res) {
  let user = await User.findById(req.user._id);
  user = user.toObject();
  delete user.hashedPassword;
  res.json({ user });

}

function login(req, res) {
  let user = req.user;
  let token = authCtrl.generateToken(user);
  res.json({ token });
}
