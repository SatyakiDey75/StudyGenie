import React, { useState } from 'react';

export default function FlashCard(props) {
  const mcq = props.quiz || []; 

  const [selectedOptions, setSelectedOptions] = useState(Array(mcq.length).fill(null));
  const [flippedCards, setFlippedCards] = useState(Array(mcq.length).fill(false));
  const [showOptions, setShowOptions] = useState(Array(mcq.length).fill(false)); 

  const handleOptionChange = (questionIndex, optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleFlipToBack = (index) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = true; 
    setFlippedCards(newFlippedCards);
  };

  const handleFlipBackToFront = (index) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = false; 
    setFlippedCards(newFlippedCards);
  };

  const toggleShowOptions = (index) => {
    const newShowOptions = [...showOptions];
    newShowOptions[index] = !newShowOptions[index];
    setShowOptions(newShowOptions);
  };

  return (
    <div className="p-6 overflow-y-auto h-[27rem] transition-all duration-300">
      <h1 className="text-2xl font-extrabold mb-4 overflow-y-auto text-center">Questions & Answers</h1>
      <>
        {mcq.map((question, index) => (
          <div
            key={index}
            className="mb-6 border p-4 rounded-lg shadow-lg card-container flex items-start transition-all duration-300"
          >
            <div className={`card ${flippedCards[index] ? 'flipped' : ''} transition-all duration-300`}>
              <div className="card-face card-front p-1 flex sha overflow-y-auto h-20 rounded-lg transition-all duration-300">
                <div className="p-4 bg-white overflow-y-auto h-48 mx-2 rounded-md">
                  <h3 className="font-normal text-md mb-2 transition-all duration-300">{index + 1}. {question.question}</h3>
                  {!flippedCards[index] && (
                    <div className="flex flex-col transition-all duration-300">
                      <div className="mb-2 transition-all duration-300">
                        <button
                          className="bg-black text-white py-1 px-2 rounded-md toggle-options-button mr-2 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShowOptions(index);
                          }}
                        >
                          {showOptions[index] ? 'Hide Options' : 'Show Options'}
                        </button>
                        <button
                          className="bg-black text-white py-1 px-2 rounded-md flip-button transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlipToBack(index);
                          }}
                        >
                          Answer
                        </button>
                      </div>
                      {showOptions[index] && (
                        <div className="transition-all grid grid-cols-2 gap-x-2 gap-y-1 duration-300">
                          {question.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className={`block mb-1 overflow-y-auto w-full text-left p-1 rounded-md text-sm ${selectedOptions[index] === optionIndex ? (option.isCorrect ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-300'} curosr-pointer transition-all duration-300`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="radio"
                                className='curosr-pointer '
                                name={`question-${index}`}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleOptionChange(index, optionIndex);
                                }}
                                checked={selectedOptions[index] === optionIndex}
                                disabled={selectedOptions[index] !== null}
                              />
                              <span className="ml-2">{option.optionText}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="card-face card-back rounded-lg transition-all duration-300">
                <div className="p-4">
                  <div className="font-bold mb-2 transition-all duration-300">Correct Answer:</div>
                  <div className={`mt-2 ${question.options.find(opt => opt.isCorrect) ? 'text-green-600' : 'text-red-600'} transition-all duration-300`}>
                    {question.options.find(opt => opt.isCorrect) ? question.options.find(opt => opt.isCorrect).optionText : 'No correct answer found'}
                  </div>
                  {flippedCards[index] && (
                    <button
                      className="bg-black text-white py-2 px-4 rounded-md flip-button mt-2 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlipBackToFront(index);
                      }}
                    >
                      Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    </div>
  );
}
