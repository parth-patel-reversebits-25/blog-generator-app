const convertMarkdownToHTML = (content: string) => {
  return content
    ?.replace(
      /^# (.*$)/gm,
      '<h1 class="text-4xl font-bold mb-6 mt-8 text-gray-900 border-b border-gray-200 pb-2">$1</h1>'
    )
    .replace(
      /^## (.*$)/gm,
      '<h2 class="text-3xl font-semibold mb-4 mt-8 text-gray-800">$1</h2>'
    )
    .replace(
      /^### (.*$)/gm,
      '<h3 class="text-2xl font-medium mb-3 mt-6 text-gray-700">$1</h3>'
    )
    .replace(
      /^#### (.*$)/gm,
      '<h4 class="text-xl font-medium mb-2 mt-4 text-gray-700">$1</h4>'
    )
    .replace(
      /^##### (.*$)/gm,
      '<h5 class="text-lg font-medium mb-2 mt-3 text-gray-700">$1</h5>'
    )
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold text-gray-900">$1</strong>'
    )
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>'
    )
    .replace(
      /```([^`]+)```/g,
      '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"><code>$1</code></pre>'
    )
    .replace(
      /^> (.*$)/gm,
      '<blockquote class="border-l-4 border-blue-500 pl-6 py-2 my-4 bg-blue-50 italic text-gray-600">$1</blockquote>'
    )
    .replace(/^\* (.*$)/gm, '<li class="mb-1 text-gray-700">$1</li>')
    .replace(/^- (.*$)/gm, '<li class="mb-1 text-gray-700">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="mb-1 text-gray-700">$1</li>')
    .replace(/(<li.*<\/li>)+/g, (match) => {
      if (match.includes("1.") || /^\d+\./.test(match)) {
        return `<ol class="list-decimal ml-6 mb-4 space-y-2">${match}</ol>`;
      }
      return `<ul class="list-disc ml-6 mb-4 space-y-2">${match}</ul>`;
    })
    .replace(
      /^([^<\n#*-].+)$/gm,
      '<p class="mb-4 leading-relaxed text-gray-700 text-base">$1</p>'
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );
};
