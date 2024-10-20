interface CodeBlockProps {
    code: string;
    language?: string;
  }
  
  export function CodeBlock({ code, language = 'python' }: CodeBlockProps) {
    return (
      <div className="relative my-4">
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    );
  }