"use client"

import dynamic from "next/dynamic"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Dynamic import for lazy loading
const MultiStepQuestionnaire = dynamic(() => import("@/components/multi-step-questionnaire"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-white">Loading questionnaire...</div>
    </div>
  ),
  ssr: false // Complex form component, better to load client-side
})

export default function QuestionnairePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="pt-16">
        <MultiStepQuestionnaire />
      </main>

      <Footer />
    </div>
  )
}
