import BlogForm from "@/components/blog-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="bg-gradient-to-br from-slate-800 to-blue-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-white">🚀 Exceptional Engineering Blog Generator</h1>
          <p className="text-lg opacity-90 text-white">
            Transform technical expertise into compelling, insightful content using Robert Roskam's framework
          </p>
        </div>

        <div className="p-10">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-5 rounded-xl mb-8">
            <h4 className="text-xl font-semibold mb-3 text-white">💡 How it works</h4>
            <p className="text-white">
              This tool applies the 6-pillar framework: Evidence, Practical guidance, Analytical depth, Speculative
              insights, Contextual understanding, and Engagement techniques. Select the elements you want included to
              generate comprehensive, research-backed content.
            </p>
          </div>

          <BlogForm />
        </div>
      </div>
    </div>
  )
}
