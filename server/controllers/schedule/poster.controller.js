const Poster = require('../../models/schedule/poster.model');
const User = require('../../models/user.model');
const Work = require('../../models/work.model');
const ChatWork = require('../../models/virtual/chatWork.model');
const Painel = require('../../models/schedule/painel.model');
const Minicurso = require('../../models/schedule/minicurso.model');


module.exports = {
  listSchedule,
  insertSchedule,
  updateSchedule,
  deleteSchedule,
  subscribePoster,
  unsubscribePoster,
  fixAuthorsPoster,
  fixAuthorsPainel,
}

async function listSchedule(date) {
  return await Poster.find({
    'dates.date': { $in: date }
  })
    .sort({
      'dates.startTime': 1
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

async function fixAuthorsPoster() {
  console.log('Corrigi')
  let posters = await Poster.find({});

  posters.forEach(async poster => {
    let schedule = await setAuthorsInPoster(poster);
    let id = schedule._id;
    delete schedule._id;

    await Poster.findOneAndUpdate({ _id: id }, schedule);
  });


}

async function insertSchedule(schedule, oldId) {

  schedule = await setAuthorsInPoster(schedule);

  const poster = await new Poster(schedule).save();

  await ChatWork.findOneAndUpdate({
    idWork: oldId
  }, {
    $set: {
      idWork: poster._id
    }
  });

  if (poster.monitor) {
    let monitors = poster.monitor.trim().split(';');
    monitors.forEach(element => {
      registerMonitor(poster._id, element.toLowerCase());
    });
  }

  if (poster.mediator) {
    registerMediator(poster._id, poster.mediator.toLowerCase());
  }

  let workWithUser;

  if (poster.worksPoster) {
    for (let index = 0; index < poster.worksPoster.length; index++) {
      workWithUser = await Work.findById({ _id: poster.worksPoster[index].work }).select('authors');
      /*      if (workWithUser.authors) {
      
              for (let userCount = 0; userCount < workWithUser.authors.length; userCount++) {
                await subscribePoster(poster._id, workWithUser.authors[userCount].userId, workWithUser.authors[userCount].email);
              }
            }*/
    }
  }

  return poster;
}

async function updateSchedule(id, schedule) {


  let posterOld = await Poster.findById(id);

  if (posterOld.monitor) {
    let monitors = posterOld.monitor.trim().split(';');
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

  return await Poster.findOneAndUpdate({ _id: id }, schedule);

}

async function deleteSchedule(id) {

  const poster = await Poster.findById({ _id: id });
  let workWithUser;

  if (poster.monitor) {
    let monitors = poster.monitor.trim().split(';');
    monitors.forEach(element => {
      unRegisterMonitor(id, element.toLowerCase());
    });
  }

  if (poster.mediator) {
    unRegisterMediator(id, poster.mediator.toLowerCase());
  }


  if (poster.worksPoster) {
    for (let index = 0; index < poster.worksPoster.length; index++) {
      workWithUser = await Work.findById({ _id: poster.worksPoster[index].work }).select('authors');
      if (workWithUser.authors) {

        for (let userCount = 0; userCount < workWithUser.authors.length; userCount++) {
          await unsubscribePoster(poster._id, workWithUser.authors[userCount].userId);
        }
      }
    }
  }

  await Poster.findOneAndRemove({ _id: id });
  return await poster._id;

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

async function setAuthorsInPoster(posters) {

  let workWithUser;
  let namesAuthors = [];

  if (posters.worksPoster) {
    for (let index = 0; index < posters.worksPoster.length; index++) {
      if (!posters.worksPoster[index].workTitle) continue;
      namesAuthors = [];
      workWithUser = await Work.findById({ _id: posters.worksPoster[index].work }).select('authors');
      if (workWithUser.authors) {

        for (let autores = 0; autores < workWithUser.authors.length; autores++) {
          const autoresTrabalho = workWithUser.authors[autores];
          namesAuthors.push(await User.findById(autoresTrabalho.userId).select('-_id fullname'))
        }

        posters.worksPoster[index].workAuthor = namesAuthors

      }
    }
  }

  return await posters;
}


async function unsubscribePoster(workId, userId) {

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

  return await Poster.findOneAndUpdate({
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

  let scheduleCompare = await Poster.findById(workId);

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

async function subscribePoster(workId, userId, email) {
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
          icModalityId: 3
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

    return Poster.findOneAndUpdate({
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
        icModalityId: 3
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
        icModalityId: 3
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
