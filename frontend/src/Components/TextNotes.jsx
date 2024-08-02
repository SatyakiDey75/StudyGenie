import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const TextNotes = (props) => {

  const [text, settext] = useState(true)

  const splitMarkdownIntoChunks = (markdownText) => {
    if (!markdownText) return [];

    const chunks = markdownText.split(/\n\*\*([^*]+)\*\*\n+/)
      .filter(chunk => chunk.trim().length > 0)
      .map(chunk => {
        const parts = chunk.split(/\n/);
        const heading = parts[0].trim(); 
        const content = parts.slice(1).join('\n').trim();

        return { heading, content };
      });

    return chunks;
  };

  const markdownChunks = splitMarkdownIntoChunks(props.notes);

  const newchunk = markdownChunks.slice(1);

  useEffect(() => {
    if(!props.isVdo){
      settext(true)
    }
    else {
      settext(false)
    }
  },[props.isVdo])

  return (
    <div className='h-[27.5rem] flex flex-col px-4 py-2 md:px-6 md:py-4 rounded-lg mr-2 overflow-y-auto'>
      <h1 className='text-center font-extrabold text-2xl my-2'>Notes</h1>
      {
        text 
        ?
        <>
        {newchunk.map((chunk, index) => (
          <div key={index} className='mb-4'>
          <h2 className='text-center sha rounded-lg p-2 border-2 border-black font-bold bg-[#c2f8e2]'>{chunk.heading}</h2>
          <ReactMarkdown className='bg-gray-200 p-2 text-left text-sm'>{chunk.content}</ReactMarkdown>
          </div>
        ))}
        </> 
        :
        <div className='mb-4 bg-[#c2f8e2] p-2 sha rounded-lg'>
         <ReactMarkdown>{props.notes}</ReactMarkdown>
        </div>
      }
    </div>
  );
};

export default TextNotes;
