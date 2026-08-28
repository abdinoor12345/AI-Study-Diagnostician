import { createContext, useContext, useState, type ReactNode } from 'react';

type AppContextValue = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  documentId: string | null;
  setDocumentId: React.Dispatch<React.SetStateAction<string | null>>;
  concepts: Array<{ name: string }>;
  setConcepts: React.Dispatch<React.SetStateAction<Array<{ name: string }>>>;
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  userAnswers: Record<string, string>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  initialMastery: Record<string, number>;
  setInitialMastery: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  weakestConcept: string | null;
  setWeakestConcept: React.Dispatch<React.SetStateAction<string | null>>;
  diagnosis: Record<string, any> | null;
  setDiagnosis: React.Dispatch<React.SetStateAction<Record<string, any> | null>>;
  finalMastery: Record<string, number>;
  setFinalMastery: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  resetAll: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<Array<{ name: string }>>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [initialMastery, setInitialMastery] = useState<Record<string, number>>({});
  const [weakestConcept, setWeakestConcept] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Record<string, any> | null>(null);
  const [finalMastery, setFinalMastery] = useState<Record<string, number>>({});

  const resetAll = () => {
    setDocumentId(null);
    setConcepts([]);
    setQuestions([]);
    setUserAnswers({});
    setInitialMastery({});
    setWeakestConcept(null);
    setDiagnosis(null);
    setFinalMastery({});
  };

  return (
    <AppContext.Provider value={{
      loading, setLoading,
      documentId, setDocumentId,
      concepts, setConcepts,
      questions, setQuestions,
      userAnswers, setUserAnswers,
      initialMastery, setInitialMastery,
      weakestConcept, setWeakestConcept,
      diagnosis, setDiagnosis,
      finalMastery, setFinalMastery,
      resetAll
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}