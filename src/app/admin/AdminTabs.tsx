'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GetApplications from "./GetApplications"
import GetContent from "./GetContent"
import GetNews from "./GetNews"

export default function AdminTabs({ token }: { token: string }) {
  return (
    <Tabs defaultValue="applications_tab" className="w-full h-full flex flex-col justify-center">
      <div className="w-full flex justify-center items-center bg-slate-800 opacity-80">
        <TabsList className="w-full rounded-none h-full p-4 flex flex-row justify-between md:w-8/12">
          <TabsTrigger value="news_tab" className="opacity-100 bg-white/10 p-2 w-48 text-white text-sm md:text-md lg:text-xl">Nyheter</TabsTrigger>
          <TabsTrigger value="applications_tab" className="opacity-100 bg-white/10 w-48 p-2 text-white text-sm md:text-md lg:text-xl">Søknader</TabsTrigger>
          <TabsTrigger value="content_tab" className="opacity-100 p-2 bg-white/10 w-48 text-sm text-white md:text-md lg:text-xl">Web-innhold</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="news_tab" className="w-full h-auto min-h-screen">
        <div className="flex flex-col w-full mb-4 p-4">
          <GetNews token={token} />
        </div>
      </TabsContent>

      <TabsContent value="applications_tab" className="w-auto h-auto min-h-screen">
        <div className="flex flex-col md:flex-row justify-center items-start mb-4 md:p-4">
          <GetApplications token={token} />
        </div>
      </TabsContent>

      <TabsContent value="content_tab" className="w-full h-auto min-h-screen">
        <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 p-4">
          <GetContent token={token} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
