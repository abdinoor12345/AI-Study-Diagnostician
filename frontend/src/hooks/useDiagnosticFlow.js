 import { useState } from 'react';
import { extractConcepts, generateQuiz, submitQuiz, diagnoseWeakness } from '../utils/api';
import { scoreQuiz, scorePercent, overallScore } from '../utils/mastery';

export function useDiagnosticFlow() {
  const [step, setStep] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [documentId, setDocumentId] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  const [initialMastery, setInitialMastery] = useState({});   // concept_id -> score
  const [conceptNames, setConceptNames] = useState({});       // concept_id -> name
  const [overallMastery, setOverallMastery] = useState(0);
  const [weakestConceptId, setWeakestConceptId] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [finalMastery, setFinalMastery] = useState({});

  const weakestConcept = weakestConceptId ? conceptNames[weakestConceptId] : null;

  const handleAnswer = (tempId, option) => {
    setUserAnswers((prev) => ({ ...prev, [tempId]: option }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const extractData = await extractConcepts(file);
      setDocumentId(extractData.document_id);
      setConcepts(extractData.concepts);

      const quizData = await generateQuiz({
        documentId: extractData.document_id,
        concepts: extractData.concepts,
        quizType: 'diagnostic',
      });
      setQuestions(quizData.questions);
      setQuizId(quizData.quiz_id);
      setUserAnswers({});
      setStep('quiz');
    } catch (err) {
      setError('Error processing document: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosticSubmit = async () => {
    const { masteryScores, conceptNames: names, weakestId, weakestName, failures, responses } =
      scoreQuiz(questions, userAnswers);

    setInitialMastery(masteryScores);
    setConceptNames((prev) => ({ ...prev, ...names }));
    setWeakestConceptId(weakestId);
    setOverallMastery(overallScore(questions, userAnswers));

    setLoading(true);
    setError(null);
    try {
      await submitQuiz({ quizId, responses });

      const diagData = await diagnoseWeakness({ weakConcept: weakestName, recentFailures: failures });
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
        documentId,
        concepts,
        quizType: 'practice',
        targetConcept: weakestConcept,
      });
      setQuestions(quizData.questions);
      setQuizId(quizData.quiz_id);
      setUserAnswers({});
      setStep('practice');
    } catch (err) {
      setError('Error generating practice quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeSubmit = async () => {
    const { responses } = scoreQuiz(questions, userAnswers);
    const practiceScore = scorePercent(questions, userAnswers);

    setFinalMastery({
      ...initialMastery,
      [weakestConceptId]: Math.max(initialMastery[weakestConceptId] ?? 0, practiceScore),
    });

    setLoading(true);
    setError(null);
    try {
      await submitQuiz({ quizId, responses });
      setStep('results');
    } catch (err) {
      setError('Error saving practice results: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setDocumentId(null);
    setConcepts([]);
    setQuestions([]);
    setQuizId(null);
    setUserAnswers({});
    setInitialMastery({});
    setConceptNames({});
    setOverallMastery(0);
    setWeakestConceptId(null);
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
    documentId, concepts, questions, userAnswers,
    initialMastery, conceptNames, overallMastery, weakestConcept, weakestConceptId,
    diagnosis, finalMastery,
    handleAnswer, handleFileUpload, handleDiagnosticSubmit,
    handleContinueToLesson, handleStartPractice, handlePracticeSubmit,
    handleRestart, handleBack,
  };
}