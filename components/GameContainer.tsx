
import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Question, Answer } from '../types';
import { generateSpellingQuestions } from '../services/geminiService';
import Spinner from './Spinner';

interface GameContainerProps {
  mode: GameMode;
  onGameEnd: () => void;
}

const TOTAL_CHALLENGE_QUESTIONS = 10;
const TOTAL_PRACTICE_QUESTIONS = 5;

const GameContainer: React.FC<GameContainerProps> = ({ mode, onGameEnd }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<Answer[]>([]);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const isPracticeMode = mode === GameMode.Practice;
  const totalQuestions = isPracticeMode ? TOTAL_PRACTICE_QUESTIONS : TOTAL_CHALLENGE_QUESTIONS;

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await generateSpellingQuestions(totalQuestions);
      setQuestions(fetchedQuestions);
    } catch (e: any) {
      setError(e.message || 'Er is een onbekende fout opgetreden.');
    } finally {
      setIsLoading(false);
    }
  }, [totalQuestions]);

  useEffect(() => {
    fetchQuestions();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setIsGameFinished(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!userAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctForm.toLowerCase();

    const answerRecord: Answer = {
      question: currentQuestion,
      userAnswer: userAnswer.trim(),
      isCorrect,
    };
    
    setSubmittedAnswers(prev => [...prev, answerRecord]);

    if (isPracticeMode) {
      setFeedback({ isCorrect, correctAnswer: currentQuestion.correctForm });
    } else {
      handleNextQuestion();
    }
  };

  const score = submittedAnswers.filter(a => a.isCorrect).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-xl">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Een momentje, de vragen worden voorbereid...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oeps, er ging iets mis!</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <button onClick={onGameEnd} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Terug naar Home</button>
      </div>
    );
  }

  if (isGameFinished) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          {isPracticeMode ? "Oefening Voltooid!" : `Je score: ${score} / ${totalQuestions}`}
        </h2>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {submittedAnswers.map(({ question, userAnswer, isCorrect }, index) => (
                <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                    <p className="font-semibold text-gray-700 mb-2">{index + 1}. {question.incompleteSentence.replace('[___]', `[${question.correctForm}]`)}</p>
                    <div className="flex items-center">
                        <p className={`font-mono px-2 py-1 rounded text-sm ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                           Jouw antwoord: {userAnswer}
                        </p>
                         {!isCorrect && <p className="ml-3 text-sm text-green-800">Correct was: <span className="font-bold">{question.correctForm}</span></p>}
                    </div>
                    {isPracticeMode && <p className="mt-2 text-sm text-gray-600 italic">Uitleg: {question.explanation}</p>}
                </div>
            ))}
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={onGameEnd} className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">Home</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-teal-600">{isPracticeMode ? 'Oefenmodus' : 'Uitdaging'}</h2>
            <p className="text-lg font-mono bg-gray-100 px-3 py-1 rounded-md text-gray-700">{currentQuestionIndex + 1} / {totalQuestions}</p>
        </div>

        <div className="mb-6">
            <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed text-center py-4">
                {currentQuestion.incompleteSentence.split('[___]')[0]}
                <span className="font-bold text-teal-600 underline decoration-dotted underline-offset-4 mx-2">
                    [___]
                </span>
                {currentQuestion.incompleteSentence.split('[___]')[1]}
            </p>
        </div>
        
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Typ hier het juiste woord"
                className="w-full text-center text-xl p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                disabled={!!feedback}
                autoFocus
            />

            {!feedback && (
                <button
                    type="submit"
                    className="w-full mt-4 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                    disabled={!userAnswer.trim()}
                >
                    {isPracticeMode ? 'Controleer' : 'Volgende Vraag'}
                </button>
            )}
        </form>

        {isPracticeMode && feedback && (
            <div className={`mt-4 p-4 rounded-lg text-center ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <p className="font-bold text-lg">{feedback.isCorrect ? 'Correct!' : 'Helaas, niet correct.'}</p>
                {!feedback.isCorrect && <p>Het juiste antwoord is: <span className="font-bold">{feedback.correctAnswer}</span></p>}
                <p className="mt-2 text-sm italic">{currentQuestion.explanation}</p>
                <button onClick={handleNextQuestion} className="w-full mt-4 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700">
                    {currentQuestionIndex < questions.length - 1 ? 'Volgende Vraag' : 'Resultaten'}
                </button>
            </div>
        )}
    </div>
  );
};

export default GameContainer;
