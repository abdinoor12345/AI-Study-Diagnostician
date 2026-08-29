
export function scoreQuiz(questions, userAnswers) {
  const conceptStats = {}; // concept_id -> { name, correct, total }

  const failures = [];
  const responses = [];

  questions.forEach((q) => {
    const userAnswer = userAnswers[q.temp_id];
    const isCorrect = userAnswer === q.answer;

    if (!conceptStats[q.concept_id]) {
      conceptStats[q.concept_id] = { name: q.concept_name, correct: 0, total: 0 };
    }
    conceptStats[q.concept_id].total += 1;
    if (isCorrect) conceptStats[q.concept_id].correct += 1;

    responses.push({
      concept_id: q.concept_id,
      question: q.question,
      user_answer: userAnswer || null,
      correct_answer: q.answer,
      error_tag: q.error_tag,
    });

    if (!isCorrect) {
      failures.push({
        question: q.question,
        user_answer: userAnswer || "No Answer",
        correct_answer: q.answer,
        error_tag: q.error_tag,
      });
    }
  });

  const masteryScores = {};
  const conceptNames = {};
  let lowestScore = 101;
  let weakestId = null;

  Object.entries(conceptStats).forEach(([cid, stat]) => {
    const score = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    masteryScores[cid] = score;
    conceptNames[cid] = stat.name;
    if (score < lowestScore) {
      lowestScore = score;
      weakestId = cid;
    }
  });

  return {
    masteryScores,
    conceptNames,
    weakestId,
    weakestName: weakestId ? conceptNames[weakestId] : null,
    failures,
    responses,
  };
}

export function scorePercent(questions, userAnswers) {
  const correct = questions.filter((q) => userAnswers[q.temp_id] === q.answer).length;
  return Math.round((correct / questions.length) * 100);
}

export function overallScore(questions, userAnswers) {
  if (!questions.length) return 0;
  const correct = questions.filter((q) => userAnswers[q.temp_id] === q.answer).length;
  return Math.round((correct / questions.length) * 100);
}