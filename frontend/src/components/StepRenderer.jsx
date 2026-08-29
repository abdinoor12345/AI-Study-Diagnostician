import React from 'react';
import StepNav from './StepNav';
import BackButton from './BackButton';
import { ErrorBanner, LoadingIndicator } from './StatusBanner';
import UploadStep from './UploadStep';
import QuizStep from './QuizStep';
import DiagnosisStep from './DiagnosisStep';
import LessonStep from './LessonStep';
import PracticeStep from './PracticeStep';
import ResultsStep from './ResultsStep';

export default function StepRenderer({ flow }) {
  const {
  step, loading, error,
  questions, userAnswers, weakestConcept, weakestConceptId,
  initialMastery, overallMastery, conceptNames, diagnosis, finalMastery,
  handleAnswer, handleFileUpload, handleDiagnosticSubmit,
  handleContinueToLesson, handleStartPractice, handlePracticeSubmit,
  handleRestart, handleBack,
} = flow;
  return (
    <>
      <StepNav currentStep={step} />
      <ErrorBanner message={error} />

      {!loading && step !== 'upload' && step !== 'results' && (
        <BackButton onClick={handleBack} />
      )}

      {loading && <LoadingIndicator />}

      {!loading && step === 'upload' && (
        <UploadStep onFileUpload={handleFileUpload} />
      )}

      {!loading && step === 'quiz' && (
        <QuizStep
          questions={questions}
          userAnswers={userAnswers}
          onAnswer={handleAnswer}
          onSubmit={handleDiagnosticSubmit}
        />
      )}

      {!loading && step === 'diagnosis' && (
      <DiagnosisStep
    weakestConcept={weakestConcept}
    weakestConceptId={weakestConceptId}
    initialMastery={initialMastery}
    overallMastery={overallMastery}
    diagnosis={diagnosis}
    onContinue={handleContinueToLesson}
  />
      )}

      {!loading && step === 'lesson' && (
        <LessonStep
          weakestConcept={weakestConcept}
          lessonText={diagnosis?.adaptive_lesson}
          onStartPractice={handleStartPractice}
        />
      )}

      {!loading && step === 'practice' && (
        <PracticeStep
          questions={questions}
          userAnswers={userAnswers}
          onAnswer={handleAnswer}
          onSubmit={handlePracticeSubmit}
        />
      )}

      {!loading && step === 'results' && (
        <ResultsStep
    initialMastery={initialMastery}
    finalMastery={finalMastery}
    conceptNames={conceptNames}
    onRestart={handleRestart}
  />
      )}
    </>
  );
}