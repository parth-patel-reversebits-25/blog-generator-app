export const enhanceHTML = (content: string) => {
  return content
    ?.replace(
      /<h1([^>]*)>/g,
      '<h1$1 class="text-4xl font-bold mb-6 mt-8 text-gray-900 border-b border-gray-200 pb-2">'
    )
    .replace(
      /<h2([^>]*)>/g,
      '<h2$1 class="text-3xl font-semibold mb-4 mt-8 text-gray-800">'
    )
    .replace(
      /<h3([^>]*)>/g,
      '<h3$1 class="text-2xl font-medium mb-3 mt-6 text-gray-700">'
    )
    .replace(
      /<h4([^>]*)>/g,
      '<h4$1 class="text-xl font-medium mb-2 mt-4 text-gray-700">'
    )
    .replace(
      /<h5([^>]*)>/g,
      '<h5$1 class="text-lg font-medium mb-2 mt-3 text-gray-700">'
    )
    .replace(
      /<p([^>]*)>/g,
      '<p$1 class="mb-4 leading-relaxed text-gray-700 text-base">'
    )
    .replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc ml-6 mb-4 space-y-2">')
    .replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal ml-6 mb-4 space-y-2">')
    .replace(/<li([^>]*)>/g, '<li$1 class="mb-1 text-gray-700">')
    .replace(/<strong([^>]*)>/g, '<strong$1 class="font-bold text-gray-900">')
    .replace(/<em([^>]*)>/g, '<em$1 class="italic text-gray-700">')
    .replace(
      /<blockquote([^>]*)>/g,
      '<blockquote$1 class="border-l-4 border-blue-500 pl-6 py-2 my-4 bg-blue-50 italic text-gray-600">'
    )
    .replace(
      /<code([^>]*)>/g,
      '<code$1 class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">'
    )
    .replace(
      /<pre([^>]*)>/g,
      '<pre$1 class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">'
    )
    .replace(
      /<a([^>]*)>/g,
      '<a$1 class="text-blue-600 hover:text-blue-800 underline">'
    )
    .replace(
      /<table([^>]*)>/g,
      '<table$1 class="w-full border-collapse border border-gray-300 mb-4">'
    )
    .replace(
      /<th([^>]*)>/g,
      '<th$1 class="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">'
    )
    .replace(/<td([^>]*)>/g, '<td$1 class="border border-gray-300 px-4 py-2">');
};
