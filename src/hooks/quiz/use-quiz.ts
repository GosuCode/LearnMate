"use client"

import { useState, useCallback } from "react"

export interface QuizQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    topic: string
    difficulty: string
    timeSpent: number
    isCorrect: boolean
}

export interface QuizResult {
    score: number
    totalQuestions: number
    correctAnswers: number
    incorrectAnswers: number
    averageTime: number
    timePerQuestion: QuizQuestion[]
}

export type QuizState = "setup" | "quiz" | "results"

export function useQuiz() {
    const [quizState, setQuizState] = useState<QuizState>("setup")
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [quizStartTime, setQuizStartTime] = useState<number>(0)
    const [quizResults, setQuizResults] = useState<QuizResult | null>(null)
    const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([])

    const startQuiz = useCallback(() => {
        if (generatedQuestions.length === 0) return

        setQuizState("quiz")
        setCurrentQuestionIndex(0)
        setQuizStartTime(Date.now())
    }, [generatedQuestions.length])

    const handleAnswer = useCallback(
        (selectedAnswer: number) => {
            const currentQuestion = generatedQuestions[currentQuestionIndex]
            const isCorrect = selectedAnswer === currentQuestion.correctAnswer

            const updatedQuestions = [...generatedQuestions]
            updatedQuestions[currentQuestionIndex] = {
                ...currentQuestion,
                isCorrect,
                timeSpent: Date.now() - quizStartTime,
            }
            setGeneratedQuestions(updatedQuestions)

            if (currentQuestionIndex < generatedQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
                setQuizStartTime(Date.now())
            } else {
                finishQuiz(updatedQuestions)
            }
        },
        [generatedQuestions, currentQuestionIndex, quizStartTime],
    )

    const finishQuiz = useCallback((questions: QuizQuestion[]) => {
        const correctAnswers = questions.filter((q) => q.isCorrect).length
        const totalTime = questions.reduce((sum, q) => sum + q.timeSpent, 0)
        const averageTime = totalTime / questions.length

        setQuizResults({
            score: (correctAnswers / questions.length) * 100,
            totalQuestions: questions.length,
            correctAnswers,
            incorrectAnswers: questions.length - correctAnswers,
            averageTime,
            timePerQuestion: questions,
        })

        setQuizState("results")
    }, [])

    const resetQuiz = useCallback(() => {
        setQuizState("setup")
        setCurrentQuestionIndex(0)
        setQuizResults(null)
        setGeneratedQuestions([])
    }, [])

    return {
        quizState,
        currentQuestionIndex,
        quizResults,
        generatedQuestions,
        startQuiz,
        handleAnswer,
        resetQuiz,
        setGeneratedQuestions,
    }
}
