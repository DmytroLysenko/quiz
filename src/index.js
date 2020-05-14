import createQuizTo from "./utils/createQuiz";
import "./css/styles.css";

const refs = {
  quiz: document.getElementById("quiz"),
};

createQuizTo(refs.quiz);
