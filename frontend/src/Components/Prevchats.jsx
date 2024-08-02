import React from 'react'
import { Link } from 'react-router-dom'

export default function Prevchats(props) {
  return (
    <>
    <li className='list-none mt-5 rounded-lg'>
            <Link
            to={`/chat/${props.res}`}
            className="flex items-center p-2 text-gray-900 rounded-lg bg-gray-200 group hover:bg-gray-300 transition-all duration-200"
            >
            <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="#47d49c"
                viewBox="0 0 22 21"
            >
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"
                />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span className="ml-3">{props.title}</span>
            </Link>
        </li>
    </>
  )
}
