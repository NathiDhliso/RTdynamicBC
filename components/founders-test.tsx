"use client"

import RabelaniProfileCard from "@/components/rabelani-profile-card"
import TshephishoProfileCard from "@/components/tshephisho-profile-card"

export default function FoundersTest() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-black">Founders Test Page</h1>
      
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16">
        <div className="w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-black">Rabelani Card</h2>
          <RabelaniProfileCard />
        </div>
        
        <div className="w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-black">Tshephisho Card</h2>
          <TshephishoProfileCard />
        </div>
      </div>
    </div>
  )
}
