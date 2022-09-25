const Painel = require('../../models/schedule/painel.model');
const User = require('../../models/user.model');
const Work = require('../../models/work.model');
const ChatWork = require('../../models/virtual/chatWork.model');

module.exports = {
  listSchedule,
  insertSchedule,
  updateSchedule,
  deleteSchedule,
  unsubscribePainel,
  subscribePainel,
}

async function listSchedule(date) {
  return await Painel.find({
    'dates.date': { $in: date }
  })
    .sort({
      'dates.startTime': 1
    });
}

async function insertSchedule(schedule, oldId) {

  schedule = await setAuthorsInPainel(schedule);

  const painel = await new Painel(schedule).save();

  await ChatWork.findOneAndUpdate({
    idWork: oldId
  }, {
    $set: {
      idWork: painel._id
    }
  });

  if (painel.monitor) {
    let monitors = painel.monitor.trim().split(';');
    monitors.forEach(element => {
      registerMonitor(painel._id, element.toLowerCase());
    });
  }

  if (painel.mediator) {
    registerMediator(painel._id, painel.mediator.toLowerCase());
  }

  let workWithUser;

  if (painel.worksPainel) {
    for (let index = 0; index < painel.worksPainel.length; index++) {
      workWithUser = await Work.findById({ _id: painel.worksPainel[index].work }).select('authors');
      if (workWithUser.authors) {

        for (let userCount = 0; userCount < workWithUser.authors.length; userCount++) {
          await subscribePainel(painel._id, workWithUser.authors[userCount].userId, workWithUser.authors[userCount].email);
        }
      }
    }
  }

  return painel;
}

async function updateSchedule(id, schedule) {

  let oldId = await deleteSchedule(id);
  delete schedule._id;
  return await insertSchedule(schedule, oldId);


}

async function deleteSchedule(id) {

  const painel = await Painel.findById({ _id: id });
  let workWithUser;

  if (painel.monitor) {
    let monitors = painel.monitor.trim().split(';');
    monitors.forEach(element => {
      unRegisterMonitor(id, element.toLowerCase());
    });
  }

  if (painel.mediator) {
    unRegisterMediator(id, painel.mediator.toLowerCase());
  }


  if (painel.worksPainel) {
    for (let index = 0; index < painel.worksPainel.length; index++) {
      workWithUser = await Work.findById({ _id: painel.worksPainel[index].work }).select('authors');
      if (workWithUser.authors) {

        for (let userCount = 0; userCount < workWithUser.authors.length; userCount++) {
          await unsubscribePainel(painel._id, workWithUser.authors[userCount].userId);
        }
      }
    }
  }

  await Painel.findOneAndRemove({ _id: id });
  return await painel._id;

}



async function setAuthorsInPainel(painels) {

  let workWithUser;
  let namesAuthors = [];

  if (painels.worksPainel) {
    for (let index = 0; index < painels.worksPainel.length; index++) {
      if (!painels.worksPainel[index].workTitle) continue;
      namesAuthors = [];
      workWithUser = await Work.findById({ _id: painels.worksPainel[index].work }).select('authors');
      if (workWithUser.authors) {

        for (let autores = 0; autores < workWithUser.authors.length; autores++) {
          const autoresTrabalho = workWithUser.authors[autores];
          namesAuthors.push(await User.findById(autoresTrabalho.userId).select('-_id fullname'))
        }

        painels.worksPainel[index].workAuthor = namesAuthors

      }
    }
  }

  return await painels;
}


async function unsubscribePainel(workId, userId) {

  await User.findOneAndUpdate({
    _id: userId
  }, {
    $pull: {
      cursosInscritos: {
        'idSchedule': workId
      }

    }
  }, function (err, doc) {
    if (err) {
      console.log("Erro ao remover inscricao do trabalho ", err);
    } else {
      console.log("Sucesso ao remover inscricao do trabalho: ", err);
    }
  });

  return await Painel.findOneAndUpdate({
    _id: workId
  }, {
    $pull: {
      subscribers: {
        userId: userId
      }
    }
  }, {
    new: true
  });
}

async function subscribePainel(workId, userId, email) {
  let userInsert = {
    userId: userId,
    userEmail: email
  }

  await User.findOneAndUpdate({
    _id: userId
  }, {
    $addToSet: {
      cursosInscritos: {
        idSchedule: workId,
        icModalityId: 5
      }
    }
  }, (err, doc) => {
    if (err) {
      console.log("Erro ao atualizar o usuario subscribeMinicurso -> " + err);
    }
  });


  return await Painel.findOneAndUpdate({
    _id: workId
  }, {
    $addToSet: {
      'subscribers': userInsert
    }
  }, {
    new: true
  });
}

async function registerMonitor(workId, email) {
  await User.findOneAndUpdate({
    email: email
  }, {
    $addToSet: {
      monitor: {
        idSchedule: workId,
        icModalityId: 5
      }
    }
  }, (err, doc) => {
    if (err) {
      console.log("erro ao registrar monitor -> " + err);
    }
  });
}


async function unRegisterMonitor(workId, email) {
  await User.findOneAndUpdate({
    email: email
  }, {
    $pull: {
      monitor: {
        'idSchedule': workId
      }

    }
  }, function (err, doc) {
    if (err) {
      console.log("Erro ao remover monitor", err);
    } else {
      console.log("Sucesso ao remover monitor ", err);
    }
  });
}


async function registerMediator(workId, email) {
  await User.findOneAndUpdate({
    email: email
  }, {
    $addToSet: {
      mediador: {
        idSchedule: workId,
        icModalityId: 5
      }
    }
  }, (err, doc) => {
    if (err) {
      console.log("erro ao registrar mediador -> " + err);
    }
  });
}


async function unRegisterMediator(workId, email) {
  await User.findOneAndUpdate({
    email: email
  }, {
    $pull: {
      mediador: {
        'idSchedule': workId
      }

    }
  }, function (err, doc) {
    if (err) {
      console.log("Erro ao remover monitor", err);
    } else {
      console.log("Sucesso ao remover monitor ", err);
    }
  });
}
