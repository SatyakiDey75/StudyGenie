import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const TextSummary = (props) => {

  const [text, settext] = useState(true)

  console.log(props.summa)

  const splitMarkdownIntoChunks = (markdownText) => {

    const chunks = markdownText.split(/\n\n(?=\*\*[^*]+\*\*:\s)/);

    const parsedChunks = chunks.map((chunk) => {
      const match = /\*\*(.*?)\*\*:\s(.*)/.exec(chunk);
      if (match) {
        return { heading: match[1], content: match[2] };
      } else {
        return null; 
      }
    }).filter(Boolean);

    return parsedChunks;
  };

const markdownChunks = splitMarkdownIntoChunks(props.summa);

useEffect(() => {
  if(!props.isVdo){
    settext(true)
  }
  else {
    settext(false)
  }
},[props.isVdo])

  return (
    <div className='h-[27rem] overflow-y-auto p-2'>
      <h1 className='text-center font-extrabold text-2xl my-2'>Summary</h1>
      {(text && markdownChunks.length) ?
        <>
        {markdownChunks.map((chunk, index) => (
          <div key={index} className='my-2 p-2 rounded-lg bg-[#c2f8e2] sha'>
          <h2 className='font-bold'>{chunk.heading}</h2>
          <ReactMarkdown>{chunk.content}</ReactMarkdown>
          </div>
        ))}
        </>
        :
        <div className='my-2 p-2 rounded-lg bg-[#c2f8e2] sha'>
          <ReactMarkdown>{props.summa}</ReactMarkdown>
        </div>
      }
    </div>
  );
};

export default TextSummary;
