import quizData from "./quizData";

export default function createQuiz(el) {
  const fragment = document.createDocumentFragment();
  const formQuiz = document.createElement("form");
  formQuiz.classList.add("quiz__form");
  const template = `<h2 class="quiz__title">${quizData.name}</h2>`;
  formQuiz.insertAdjacentHTML("beforeend", template);
  const markupQuiz = quizData.items.reduce((total, elItem) => {
    total += `
    <section class="quiz__item">
        <h3 class="quiz__question">${elItem.question}</h3>
        <ul class="question__list">
          ${elItem.choices.reduce((total, el, idx) => {
            total += `
            <li class="question__item">
            <input type="${
              elItem.answer.length === 1 ? "radio" : "checkbox"
            }" name="${elItem.id}" id="${elItem.id}_${idx}">
            <label for="${elItem.id}_${idx}">${el}</label>
            </li>
            `;
            return total;
          }, "")}
        </ul>
    </section>
    `;
    return total;
  }, "");

  formQuiz.insertAdjacentHTML("beforeend", markupQuiz);
  const btnsMarkup = `
  <div class="btn_controls">
  <button class="quiz__btn" type="submit">Submit</button>
  <button class="quiz__btn" type="reset">Clear</button>
  </div>
  `;

  formQuiz.insertAdjacentHTML("beforeend", btnsMarkup);
  fragment.appendChild(formQuiz);

  el.appendChild(fragment);

  quiz.addEventListener("submit", handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();

  const quizStatus = makeQiuzStatus(quizData, e);

  const totalResault = logTotalResault(quizStatus);

  changeQuizDOM(quizStatus, e);

  showModal(totalResault);

  // checkSubmit(quiz, quizData.items);
}

function makeQiuzStatus(data, e) {
  const form = e.target;
  const quizStatus = [];
  // Добавление данных из data
  data.items.forEach((_) => {
    const id = _.id;
    const questionLink = form
      .querySelector(`input[name="${id}"]`)
      .closest("section");
    // Наполнение объекта статуса по отдельному вопросу
    const questionStatus = {
      [id]: questionLink,
      answer: _.answer.map((el) =>
        form.querySelector(`[id="${id}_${el}"]`).getAttribute("id")
      ),
      user: [],
      point: 0,
    };
    quizStatus.push(questionStatus);
  });
  // Сохрание отмеченных данных пользователем - id-input
  form.querySelectorAll("input").forEach((i) => {
    if (i.checked) {
      const idInput = i.getAttribute("id");
      const idQuestion = i.getAttribute("name");

      quizStatus
        .filter((_) => Object.keys(_).includes(idQuestion))[0]
        .user.push(idInput);
    }
  });
  // Расчет баллов по вопросам
  quizStatus.forEach((_) => {
    const pointQuestion = 1;
    const countAnsw = _.answer.length;
    const pointSingleAnsw = pointQuestion / countAnsw;
    // Польователь не ответит на вопрос
    if (!_.user.length) {
      _.point = -pointQuestion;
      return;
    }
    const totalPoint = _.user.reduce((total, el) => {
      total += _.answer.includes(el) ? pointSingleAnsw : -pointSingleAnsw;
      return total;
    }, 0);
    _.point = totalPoint;
  });
  return quizStatus;
}

function logTotalResault(data) {
  const pointsArr = data.map((el) => el.point);
  let totalPoint =
    (pointsArr.reduce((total, el) => (total += el > 0 ? el : 0), 0) * 100) /
    pointsArr.length;
  totalPoint = totalPoint % 1 === 0 ? totalPoint : totalPoint.toFixed(2);
  // console.log(`Total point is ${totalPoint}%`);
  return totalPoint;
}

function changeQuizDOM(data, e) {
  const form = e.target;
  // Отчистка предыдущих изменений
  form.querySelectorAll("*").forEach((el) => el.removeAttribute("style"));

  // Отметка неправильных ответов пользователя
  data.forEach((_) => {
    const el = _.question;
    // console.log(el);
    _.user.forEach((usrChoice) => {
      if (!_.answer.includes(usrChoice)) {
        form
          .querySelector(`label[for="${usrChoice}"]`)
          .setAttribute("style", "color:red");
      }
    });
    // const label = form.querySelector(`label[for="${_.user[0]}"]`);
    // console.log(label);
  });
}

function showModal(total) {
  const modal = document.querySelector(".modal");
  const modalContext = modal.querySelector(".modal__text");

  modalContext.textContent = `Your resault is ${total}% ${
    total > 70 ? ":)" : ":("
  }`;
  modal.classList.add("is-open");

  modal.addEventListener("click", handleModal);
}

function handleModal(e) {
  const modal = e.currentTarget;
  const btn = modal.querySelector(".modal_btn");
  const target = e.target;
  if (target !== btn) {
    return;
  }
  modal.classList.remove("is-open");
}
