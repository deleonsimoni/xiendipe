const Painel = require('../../models/schedule/painel.model');
const Minicurso = require('../../models/schedule/minicurso.model');
const Poster = require('../../models/schedule/poster.model');
const User = require('../../models/user.model');
const Work = require('../../models/work.model');

module.exports = {
  listSchedule,
  insertSchedule,
  updateSchedule,
  deleteSchedule,
  unsubscribePainel,
  subscribePainel,
  fixAuthorsPainel
}

async function listSchedule(date) {
  return await Painel.find({
    'dates.date': { $in: date }
  })
    .sort({
      createAt: 1
    });
}

async function insertSchedule(schedule) {

  let painel = await new Painel(schedule).save();

  if (painel.monitor) {
    let monitors = painel.monitor.trim().split(';');
    monitors.forEach(element => {
      registerMonitor(painel._id, element.toLowerCase());
    });
  }

  return await painel;

}

async function updateSchedule(id, schedule) {

  let painelOld = await Painel.findById(id);

  if (painelOld.monitor) {
    let monitors = painelOld.monitor.trim().split(';');
    monitors.forEach(element => {
      unRegisterMonitor(id, element.toLowerCase());
    });
  }

  if (schedule.monitor) {
    let monitors = schedule.monitor.trim().split(';');
    monitors.forEach(element => {
      registerMonitor(id, element.toLowerCase());
    });
  }

  return await Painel.findOneAndUpdate({ _id: id }, schedule);

}

async function deleteSchedule(id) {

  let painelOld = await Painel.findById(id);

  if (painelOld.monitor) {
    let monitors = painelOld.monitor.trim().split(';');
    monitors.forEach(element => {
      unRegisterMonitor(id, element.toLowerCase());
    });
  }

  return await Painel.findOneAndRemove({
    _id: id
  });


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

  return Painel.findOneAndUpdate({
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

async function getSchedulesDates(mySchedules) {

  let schedulesDatesCheck = [];
  for (let index = 0; index < mySchedules.cursosInscritos.length; index++) {
    switch (mySchedules.cursosInscritos[index].icModalityId) {
      case 3: //Poster
        await schedulesDatesCheck.push(await Poster.findById(mySchedules.cursosInscritos[index].idSchedule).select('dates -_id'));
        break;
      case 4: //minicurso
        await schedulesDatesCheck.push(await Minicurso.findById(mySchedules.cursosInscritos[index].idSchedule).select('dates -_id'));
        break;
      case 5: //painel
        await schedulesDatesCheck.push(await Painel.findById(mySchedules.cursosInscritos[index].idSchedule).select('dates -_id'));
        break;
    }
  }

  return await schedulesDatesCheck;

}

async function checkSubscribeDup(workId, userId) {

  let msg = 'Inscrição realizada com sucesso';

  let scheduleCompare = await Painel.findById(workId);

  if ((scheduleCompare.subscribers.length + 1) > scheduleCompare.qtdSubscribers) {
    return { isDup: true, msg: 'Vagas Esgotadas' };
  } else {

    let mySchedules = await User.findById(userId).select('cursosInscritos');

    if (mySchedules.cursosInscritos) {

      let schedulesDatesCheck = await getSchedulesDates(mySchedules);

      if (schedulesDatesCheck) {

        for (let index = 0; index < schedulesDatesCheck.length; index++) {
          for (let k = 0; k < schedulesDatesCheck[index].dates.length; k++) {
            const scheduleDateCheck = schedulesDatesCheck[index].dates[k];

            for (let j = 0; j < scheduleCompare.dates.length; j++) {

              if (scheduleCompare.dates[j].date == scheduleDateCheck.date &&
                scheduleCompare.dates[j].startTime.replace(':', '') >= scheduleDateCheck.startTime.replace(':', '') &&
                scheduleCompare.dates[j].endTime.replace(':', '') <= scheduleDateCheck.endTime.replace(':', '')) {

                return { isDup: true, msg: 'Você possui inscrição em uma atividade nesse mesmo dia e horário' };

              }
            }
          }
        }
      }

    } else {

      return { isDup: false, msg: msg };

    }
  }
}

async function subscribePainel(workId, userId, email) {

  let checkIsDup = await checkSubscribeDup(workId, userId);

  if (checkIsDup && checkIsDup.isDup) {

    return checkIsDup;

  } else {

    let userInsert = {
      userId: userId,
      userEmail: email
    }

    await User.findOneAndUpdate({
      _id: userId
    }, {
      $addToSet: {
        'cursosInscritos': {
          idSchedule: workId,
          icModalityId: 5
        }
      }
    }, {
      upsert: true,
      new: true
    }, (err, doc) => {
      if (err) {
        console.log("Erro ao atualizar o usuario painel -> " + err);
      }
    });

    return Painel.findOneAndUpdate({
      _id: workId
    }, {
      $addToSet: {
        'subscribers': userInsert
      }
    }, {
      new: true
    });

  }
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

async function fixAuthorsPainel() {
  console.log('Corrigia')
  let posters = await Painel.find({});

  posters.forEach(async poster => {
    let schedule = await setAuthorsInPainel(poster);
    let id = schedule._id;
    delete schedule._id;

    await Painel.findOneAndUpdate({ _id: id }, schedule);
  });


}

async function setAuthorsInPainel(posters) {

  let workWithUser;
  let namesAuthors = [];

  if (posters.worksPainel) {
    for (let index = 0; index < posters.worksPainel.length; index++) {
      if (!posters.worksPainel[index].workTitle) continue;
      namesAuthors = [];
      workWithUser = await Work.findById({ _id: posters.worksPainel[index].work }).select('authors');
      if (workWithUser.authors) {

        for (let autores = 0; autores < workWithUser.authors.length; autores++) {
          const autoresTrabalho = workWithUser.authors[autores];
          namesAuthors.push(await User.findById(autoresTrabalho.userId).select('-_id fullname'))
        }

        posters.worksPainel[index].workAuthor = namesAuthors

      }
    }
  }

  return await posters;
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
