'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import PageTitleUpdater from "@/components/page_title_updater"

export default function AboutUs() {
 

  return (
    <div className=" bg-[#090a0c] text-white">
      {/* Header */}
       <PageTitleUpdater
        anotherPage="About Us"
      />
      <Footer />
    </div>
  )
}
