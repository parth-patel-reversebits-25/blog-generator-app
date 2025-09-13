import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Blog Content</h3>
        <p className="text-gray-600 text-center max-w-md">
          Our AI is crafting exceptional content tailored to your specifications. This may take a moment...
        </p>
      </CardContent>
    </Card>
  )
}
