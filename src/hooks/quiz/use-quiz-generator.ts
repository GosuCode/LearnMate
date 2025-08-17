"use client"

import { useState, useCallback } from "react"
import { mcqApi } from "@/lib"
import type { QuizQuestion } from "./use-quiz"

export function useQuizGenerator() {
    const [inputText, setInputText] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
    const [numQuestions, setNumQuestions] = useState(5)
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string>("")

    const generateMCQs = useCallback(async (): Promise<QuizQuestion[]> => {
        if (!inputText.trim()) {
            throw new Error("Please enter some text to generate MCQs")
        }

        setIsGenerating(true)
        setError("")

        try {
            const data = await mcqApi.generateMCQs({
                text: inputText,
                num_questions: numQuestions,
            })

            if (!data.mcqs || data.mcqs.length === 0) {
                throw new Error("No questions were generated. Please try with different text.")
            }

            const transformedQuestions: QuizQuestion[] = data.mcqs.map(
                (
                    mcq: {
                        question: string
                        options: string[]
                        correct_answer_index: number
                    },
                    index: number,
                ) => ({
                    id: index + 1,
                    question: mcq.question,
                    options: mcq.options,
                    correctAnswer: mcq.correct_answer_index,
                    topic: "Custom Topic",
                    difficulty: selectedDifficulty || "Medium",
                    timeSpent: 0,
                    isCorrect: false,
                }),
            )

            return transformedQuestions
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to generate MCQs. Please try again."
            setError(errorMessage)
            throw error
        } finally {
            setIsGenerating(false)
        }
    }, [inputText, numQuestions, selectedDifficulty])

    const clearError = useCallback(() => setError(""), [])

    return {
        inputText,
        setInputText,
        selectedDifficulty,
        setSelectedDifficulty,
        numQuestions,
        setNumQuestions,
        isGenerating,
        error,
        generateMCQs,
        clearError,
    }
}
