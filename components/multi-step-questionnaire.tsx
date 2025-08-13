"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioCardGroup, type RadioCardOption } from "@/components/ui/radio-card-group"
import { Building2, Users, FileCheck, Target, ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormData {
  // Step 1: Company Information
  entityType: string
  annualRevenue: string
  companyName: string
  industry: string

  // Step 2: Operational Complexity
  employees: string
  employeeCount: string
  stockManagement: string
  foreignCurrency: string

  // Step 3: Compliance (conditional)
  taxCompliance: string
  auditRequirements: string
  regulatoryReporting: string

  // Step 4: Goals & Contact
  primaryGoal: string
  challenges: string
  contactName: string
  email: string
  phone: string
}

const initialFormData: FormData = {
  entityType: "",
  annualRevenue: "",
  companyName: "",
  industry: "",
  employees: "",
  employeeCount: "",
  stockManagement: "",
  foreignCurrency: "",
  taxCompliance: "",
  auditRequirements: "",
  regulatoryReporting: "",
  primaryGoal: "",
  challenges: "",
  contactName: "",
  email: "",
  phone: "",
}

const steps = [
  {
    id: 1,
    title: "Company Information",
    description: "Basic details about your business",
    icon: Building2,
  },
  {
    id: 2,
    title: "Operational Complexity",
    description: "Your business operations",
    icon: Users,
  },
  {
    id: 3,
    title: "Compliance",
    description: "Regulatory requirements",
    icon: FileCheck,
  },
  {
    id: 4,
    title: "Goals & Contact",
    description: "Your objectives and contact details",
    icon: Target,
  },
]

const MultiStepQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const router = useRouter()

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    switch (step) {
      case 1:
        if (!formData.entityType) newErrors.entityType = "Entity type is required"
        if (!formData.annualRevenue) newErrors.annualRevenue = "Annual revenue is required"
        if (!formData.companyName) newErrors.companyName = "Company name is required"
        if (!formData.industry) newErrors.industry = "Industry is required"
        break
      case 2:
        if (!formData.employees) newErrors.employees = "Employee information is required"
        if (formData.employees === "Yes" && !formData.employeeCount) {
          newErrors.employeeCount = "Employee count is required"
        }
        if (!formData.stockManagement) newErrors.stockManagement = "Stock management information is required"
        if (!formData.foreignCurrency) newErrors.foreignCurrency = "Foreign currency information is required"
        break
      case 3:
        // Only validate if entity type is Private Limited
        if (formData.entityType === "Private Limited (Pty) Ltd") {
          if (!formData.taxCompliance) newErrors.taxCompliance = "Tax compliance information is required"
          if (!formData.auditRequirements) newErrors.auditRequirements = "Audit requirements information is required"
          if (!formData.regulatoryReporting)
            newErrors.regulatoryReporting = "Regulatory reporting information is required"
        }
        break
      case 4:
        if (!formData.primaryGoal) newErrors.primaryGoal = "Primary goal is required"
        if (!formData.challenges) newErrors.challenges = "Challenges information is required"
        if (!formData.contactName) newErrors.contactName = "Contact name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.phone) newErrors.phone = "Phone number is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2 && formData.entityType !== "Private Limited (Pty) Ltd") {
        setCurrentStep(4)
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep === 4 && formData.entityType !== "Private Limited (Pty) Ltd") {
      setCurrentStep(2)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      router.push("/confirmation")
    }
  }

  const getProgress = () => {
    const totalSteps = shouldShowStep3 ? 4 : 3
    let adjustedCurrentStep = currentStep
    
    // If we're on step 4 but step 3 is skipped, treat it as step 3 of 3
    if (currentStep === 4 && !shouldShowStep3) {
      adjustedCurrentStep = 3
    }
    
    return Math.min((adjustedCurrentStep / totalSteps) * 100, 100)
  }

  const getDisplayStep = () => {
    if (currentStep === 4 && !shouldShowStep3) {
      return 3
    }
    return currentStep
  }

  const shouldShowStep3 = formData.entityType === "Private Limited (Pty) Ltd"

  const entityTypeOptions: RadioCardOption[] = [
    { value: "Sole Proprietorship", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "Private Limited (Pty) Ltd", label: "Private Limited (Pty) Ltd" },
    { value: "Public Company", label: "Public Company" },
    { value: "Non-Profit Organization", label: "Non-Profit Organization" },
  ]

  const annualRevenueOptions: RadioCardOption[] = [
    { value: "Under R500,000", label: "Under R500,000" },
    { value: "R500,000 - R2 million", label: "R500,000 - R2 million" },
    { value: "R2 million - R10 million", label: "R2 million - R10 million" },
    { value: "R10 million - R50 million", label: "R10 million - R50 million" },
    { value: "Over R50 million", label: "Over R50 million" },
  ]

  const industryOptions: RadioCardOption[] = [
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Retail/Wholesale", label: "Retail/Wholesale" },
    { value: "Professional Services", label: "Professional Services" },
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Construction", label: "Construction" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Other", label: "Other" },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-fluid-xl">
            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-lg block border-b border-gray-200 pb-fluid-sm">Entity Type *</Label>
              <RadioCardGroup
                options={entityTypeOptions}
                value={formData.entityType}
                onValueChange={(value) => updateFormData("entityType", value)}
                className="grid-cols-1"
              />
              {errors.entityType && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.entityType}</p>}
            </div>

            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-lg block border-b border-gray-200 pb-fluid-sm">Annual Revenue *</Label>
              <RadioCardGroup
                options={annualRevenueOptions}
                value={formData.annualRevenue}
                onValueChange={(value) => updateFormData("annualRevenue", value)}
                className="grid-cols-1"
              />
              {errors.annualRevenue && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.annualRevenue}</p>}
            </div>

            <div>
              <Label htmlFor="companyName" className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-md block border-b border-gray-200 pb-fluid-sm">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                className={`mt-fluid-xs ${errors.companyName ? "border-red-500" : ""}`}
                placeholder="Enter your company name"
              />
              {errors.companyName && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.companyName}</p>}
            </div>

            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-lg block border-b border-gray-200 pb-fluid-sm">Industry *</Label>
              <RadioCardGroup
                options={industryOptions}
                value={formData.industry}
                onValueChange={(value) => updateFormData("industry", value)}
                className="grid-cols-1 md:grid-cols-2"
              />
              {errors.industry && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.industry}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-12">
            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-lg block border-b border-gray-200 pb-fluid-sm">Do you have employees? *</Label>
              <RadioCardGroup
                options={[
                  { value: "Yes", label: "Yes, I have employees" },
                  { value: "No", label: "No, I work alone" },
                ]}
                value={formData.employees}
                onValueChange={(value) => updateFormData("employees", value)}
                className="grid-cols-1"
              />
              {errors.employees && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.employees}</p>}
            </div>

            {formData.employees === "Yes" && (
              <div>
                <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-lg block border-b border-gray-200 pb-fluid-sm">How many employees? *</Label>
                <RadioCardGroup
                  options={[
                    { value: "1-5", label: "1-5 employees" },
                    { value: "6-20", label: "6-20 employees" },
                    { value: "21-50", label: "21-50 employees" },
                    { value: "51-100", label: "51-100 employees" },
                    { value: "Over 100", label: "Over 100 employees" },
                  ]}
                  value={formData.employeeCount}
                  onValueChange={(value) => updateFormData("employeeCount", value)}
                  className="grid-cols-1"
                />
                {errors.employeeCount && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.employeeCount}</p>}
              </div>
            )}

            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-8 block border-b border-gray-200 pb-4">
                Do you manage stock/inventory? *
              </Label>
              <RadioCardGroup
                options={[
                  { value: "Yes, significant stock", label: "Yes, significant stock" },
                  { value: "Yes, minimal stock", label: "Yes, minimal stock" },
                  { value: "No stock", label: "No stock" },
                ]}
                value={formData.stockManagement}
                onValueChange={(value) => updateFormData("stockManagement", value)}
                className="grid-cols-1"
              />
              {errors.stockManagement && <p className="text-red-500 text-fluid-sm mt-2">{errors.stockManagement}</p>}
            </div>

            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-8 block border-b border-gray-200 pb-4">
                Do you deal in foreign currency? *
              </Label>
              <RadioCardGroup
                options={[
                  { value: "Yes, regularly", label: "Yes, regularly" },
                  { value: "Yes, occasionally", label: "Yes, occasionally" },
                  { value: "No", label: "No" },
                ]}
                value={formData.foreignCurrency}
                onValueChange={(value) => updateFormData("foreignCurrency", value)}
                className="grid-cols-1"
              />
              {errors.foreignCurrency && <p className="text-red-500 text-fluid-sm mt-2">{errors.foreignCurrency}</p>}
            </div>
          </div>
        )

      case 3:
        return shouldShowStep3 ? (
          <div className="space-y-12">
            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-8 block border-b border-gray-200 pb-4">Tax compliance complexity *</Label>
              <RadioCardGroup
                options={[
                  { value: "Simple", label: "Simple - Basic tax returns" },
                  { value: "Moderate", label: "Moderate - Some complexity" },
                  { value: "Complex", label: "Complex - Multiple tax obligations" },
                ]}
                value={formData.taxCompliance}
                onValueChange={(value) => updateFormData("taxCompliance", value)}
                className="grid-cols-1"
              />
              {errors.taxCompliance && <p className="text-red-500 text-fluid-sm mt-2">{errors.taxCompliance}</p>}
            </div>

            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-8 block border-b border-gray-200 pb-4">Audit requirements *</Label>
              <RadioCardGroup
                options={[
                  { value: "Required", label: "Annual audit required" },
                  { value: "Optional", label: "Audit optional" },
                  { value: "Not required", label: "No audit required" },
                ]}
                value={formData.auditRequirements}
                onValueChange={(value) => updateFormData("auditRequirements", value)}
                className="grid-cols-1"
              />
              {errors.auditRequirements && (
                <p className="text-red-500 text-fluid-sm mt-2">{errors.auditRequirements}</p>
              )}
            </div>

            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-8 block border-b border-gray-200 pb-4">Regulatory reporting *</Label>
              <RadioCardGroup
                options={[
                  { value: "Extensive", label: "Extensive reporting required" },
                  { value: "Moderate", label: "Moderate reporting" },
                  { value: "Minimal", label: "Minimal reporting" },
                ]}
                value={formData.regulatoryReporting}
                onValueChange={(value) => updateFormData("regulatoryReporting", value)}
                className="grid-cols-1"
              />
              {errors.regulatoryReporting && (
                <p className="text-red-500 text-fluid-sm mt-2">{errors.regulatoryReporting}</p>
              )}
            </div>
          </div>
        ) : null

      case 4:
        return (
          <div className="space-y-12">
            <div>
              <Label className="font-poppins font-light text-fluid-2xl text-gray-900 mb-8 block border-b border-gray-200 pb-4">Primary Goal *</Label>
              <RadioCardGroup
                options={[
                  { value: "Reduce costs", label: "Reduce costs" },
                  { value: "Improve efficiency", label: "Improve efficiency" },
                  { value: "Ensure compliance", label: "Ensure compliance" },
                  { value: "Growth planning", label: "Growth planning" },
                  { value: "Risk management", label: "Risk management" },
                ]}
                value={formData.primaryGoal}
                onValueChange={(value) => updateFormData("primaryGoal", value)}
                className="grid-cols-1"
              />
              {errors.primaryGoal && <p className="text-red-500 text-fluid-sm mt-2">{errors.primaryGoal}</p>}
            </div>

            <div>
              <Label htmlFor="challenges" className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-md block border-b border-gray-200 pb-fluid-sm">
                What are your main business challenges? *
              </Label>
              <Textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) => updateFormData("challenges", e.target.value)}
                className={`mt-fluid-xs ${errors.challenges ? "border-red-500" : ""}`}
                placeholder="Describe your main business challenges..."
                rows={4}
              />
              {errors.challenges && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.challenges}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-md">
              <div>
                <Label htmlFor="contactName" className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-md block border-b border-gray-200 pb-fluid-sm">
                  Contact Name *
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData("contactName", e.target.value)}
                  className={`mt-fluid-xs ${errors.contactName ? "border-red-500" : ""}`}
                  placeholder="Your name"
                />
                {errors.contactName && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.contactName}</p>}
              </div>

              <div>
                <Label htmlFor="email" className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-md block border-b border-gray-200 pb-fluid-sm">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={`mt-fluid-xs ${errors.email ? "border-red-500" : ""}`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.email}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="font-poppins font-light text-fluid-2xl text-gray-900 mb-fluid-md block border-b border-gray-200 pb-fluid-sm">
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className={`mt-fluid-xs ${errors.phone ? "border-red-500" : ""}`}
                placeholder="Your phone number"
              />
              {errors.phone && <p className="text-red-500 text-fluid-sm mt-fluid-xs">{errors.phone}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <section className="py-fluid-2xl bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
        {/* Header */}
        <div className="text-center mb-fluid-xl">
          <h1 className="font-poppins font-thin text-fluid-4xl md:text-fluid-5xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
            Business Health <span className="text-primary">Check</span>
          </h1>
          <p className="font-inter text-fluid-xl text-gray-600 max-w-2xl mx-auto leading-fluid-relaxed text-spacing-comfortable">
            Help us understand your business so we can provide you with a customized consultation and estimate.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-fluid-lg">
          <div className="flex justify-between items-center mb-fluid-sm">
            <span className="font-inter text-fluid-sm text-gray-600">
              Step {getDisplayStep()} of {shouldShowStep3 ? 4 : 3}
            </span>
            <span className="font-inter text-fluid-sm text-gray-600">{Math.round(getProgress())}% Complete</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-fluid-xl">
          <div className="flex space-x-fluid-sm">
            {steps.map((step) => {
              if (step.id === 3 && !shouldShowStep3) return null

              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep || (step.id === 3 && !shouldShowStep3 && currentStep === 4)

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center p-fluid-sm rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="h-6 w-6 mb-fluid-xs" />
                  <span className="font-inter text-fluid-xs font-light text-center">{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-fluid-md">
            <CardTitle className="font-poppins text-fluid-2xl text-gray-900">
              {steps.find((s) => s.id === currentStep)?.title}
            </CardTitle>
            <p className="font-inter text-fluid-base text-gray-600 mt-fluid-xs leading-fluid-relaxed text-spacing-comfortable">
              {steps.find((s) => s.id === currentStep)?.description}
            </p>
          </CardHeader>
          <CardContent className="px-fluid-lg pb-fluid-lg">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-fluid-lg">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            size="comfortable"
            className="font-inter font-light bg-transparent"
          >
            <ArrowLeft className="mr-fluid-xs h-4 w-4" />
            Previous
          </Button>

          {currentStep === (shouldShowStep3 ? 4 : 3) ? (
            <Button onClick={handleSubmit} size="spacious" className="btn-primary font-inter font-light">
              Calculate My Estimate
              <ArrowRight className="ml-fluid-xs h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} size="comfortable" className="btn-primary font-inter font-light">
              Next Step
              <ArrowRight className="ml-fluid-xs h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export default MultiStepQuestionnaire
