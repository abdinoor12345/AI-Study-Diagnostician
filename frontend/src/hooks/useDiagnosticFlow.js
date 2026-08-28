import { useState } from 'react';
import { extractConcepts, generateQuiz, diagnoseWeakness } from '../utils/api';
import { scoreQuiz, scorePercent, overallScore } from '../utils/mastery';

export function useDiagnosticFlow() {
  const [step, setStep] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [concepts, setConcepts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [initialMastery, setInitialMastery] = useState({});
  const [overallMastery, setOverallMastery] = useState(0);
  const [weakestConcept, setWeakestConcept] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [finalMastery, setFinalMastery] = useState({});

  const handleAnswer = (questionId, option) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const extractData = await extractConcepts(file);
      setConcepts(extractData.concepts);

      const quizData = await generateQuiz({
        concepts: extractData.concepts,
        quizType: 'diagnostic',
      });
      setQuestions(quizData.questions);
      setUserAnswers({});
      setStep('quiz');
    } catch (err) {
      setError('Error processing document: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosticSubmit = async () => {
    const { masteryScores, weakest, failures } = scoreQuiz(questions, userAnswers, concepts);
    setInitialMastery(masteryScores);
    setWeakestConcept(weakest);
    setOverallMastery(overallScore(questions, userAnswers));

    setLoading(true);
    setError(null);
    try {
      const diagData = await diagnoseWeakness({ weakConcept: weakest, recentFailures: failures });
      setDiagnosis(diagData);
      setStep('diagnosis');
    } catch (err) {
      setError('Error diagnosing weakness: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToLesson = () => setStep('lesson');

  const handleStartPractice = async () => {
    setLoading(true);
    setError(null);
    try {
      const quizData = await generateQuiz({
        concepts,
        quizType: 'practice',
        targetConcept: weakestConcept,
      });
      setQuestions(quizData.questions);
      setUserAnswers({});
      setStep('practice');
    } catch (err) {
      setError('Error generating practice quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeSubmit = () => {
    const practiceScore = scorePercent(questions, userAnswers);
    setFinalMastery({
      ...initialMastery,
      [weakestConcept]: Math.max(initialMastery[weakestConcept], practiceScore),
    });
    setStep('results');
  };

  const handleRestart = () => {
    setConcepts([]);
    setQuestions([]);
    setUserAnswers({});
    setInitialMastery({});
    setOverallMastery(0);
    setWeakestConcept(null);
    setDiagnosis(null);
    setFinalMastery({});
    setError(null);
    setStep('upload');
  };

  const handleBack = () => {
    const backMap = { diagnosis: 'quiz', lesson: 'diagnosis', practice: 'lesson' };
    if (backMap[step]) setStep(backMap[step]);
  };

  return {
    step, loading, error,
    concepts, questions, userAnswers,
    initialMastery, overallMastery, weakestConcept, diagnosis, finalMastery,
    handleAnswer, handleFileUpload, handleDiagnosticSubmit,
    handleContinueToLesson, handleStartPractice, handlePracticeSubmit,
    handleRestart, handleBack,
  };
}