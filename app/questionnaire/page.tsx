import Header from "@/components/header"
import Footer from "@/components/footer"
import MultiStepQuestionnaire from "@/components/multi-step-questionnaire"

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
