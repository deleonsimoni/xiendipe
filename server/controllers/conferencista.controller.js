const Conferencista = require('../models/conferencista.model');
const S3Uploader = require('./aws.controller');
const config = require('../config/config');

module.exports = {
  getConferencistas,
  insertConferencista,
  deleteConferencista
}

async function getConferencistas() {
  return await Conferencista.find()
    .sort({ fullname: 1 });
}

async function insertConferencista(req) {

  let conferencista = JSON.parse(req.body.formulario);
  let retorno = { temErro: true };

  let fileName = 'xiendipe/conferencista/' + req.files.fileArray.name;
  await S3Uploader.uploadFilePublic(fileName, req.files.fileArray.data).then(fileData => {
    console.log('Arquivo submetido para AWS ' + fileName);
    conferencista.imagePathS3 = fileName;
    retorno.temErro = false;
    return new Conferencista(conferencista).save();
  }, err => {
    console.log('Erro ao enviar imagem para AWS: ' + fileName);
    retorno.temErro = true;
    retorno.mensagem = 'Servidor momentaneamente inoperante. Tente novamente mais tarde.';
  });

  return await retorno;

}

async function deleteConferencista(id) {
  return await Conferencista.findOneAndRemove({ _id: id });
}