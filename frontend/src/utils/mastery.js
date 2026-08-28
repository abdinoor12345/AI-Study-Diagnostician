// Scores a completed quiz against concepts, returning per-concept mastery,
// the weakest concept, and the list of failed questions (for diagnosis).
export function scoreQuiz(questions, userAnswers, concepts = []) {
  const conceptStats = {};
  concepts.forEach((c) => (conceptStats[c.name] = { correct: 0, total: 0 }));

  const failures = [];

  questions.forEach((q) => {
    const isCorrect = userAnswers[q.id] === q.answer;
    if (!conceptStats[q.concept_name]) {
      conceptStats[q.concept_name] = { correct: 0, total: 0 };
    }
    conceptStats[q.concept_name].total += 1;

    if (isCorrect) {
      conceptStats[q.concept_name].correct += 1;
    } else {
      failures.push({
        question: q.question,
        user_answer: userAnswers[q.id] || "No Answer",
        correct_answer: q.answer,
        error_tag: q.error_tag,
      });
    }
  });

  const masteryScores = {};
  let lowestScore = 101;
  let weakest = null;

  Object.keys(conceptStats).forEach((cName) => {
    const stat = conceptStats[cName];
    const score = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    masteryScores[cName] = score;
    if (score < lowestScore) {
      lowestScore = score;
      weakest = cName;
    }
  });

  return { masteryScores, weakest, failures };
}

export function scorePercent(questions, userAnswers) {
  const correct = questions.filter((q) => userAnswers[q.id] === q.answer).length;
  return Math.round((correct / questions.length) * 100);
}

// Overall score across ALL questions in a quiz, independent of per-concept
// breakdown. Use this alongside masteryScores so a single wrong answer on a
// concept with few questions (0% or 100% mastery) doesn't look like it
// contradicts a decent overall performance.
export function overallScore(questions, userAnswers) {
  if (!questions.length) return 0;
  const correct = questions.filter((q) => userAnswers[q.id] === q.answer).length;
  return Math.round((correct / questions.length) * 100);
}