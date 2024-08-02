import React from 'react'
import { Link } from 'react-router-dom'

export default function Teamcard(props) {
  return (
    <>
    <Link to={props.li} target='_blank' className="flex flex-row items-center bg-white border border-gray-200 rounded-lg sha hover:bg-gray-100 mx-auto h-36 p-2 m-2">
        <img className="w-24 h-24 rounded-lg" src={props.pic} alt={props.alt}/>
        <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">{props.name}</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{props.role}</p>
        </div>
    </Link>
    </>
  )
}
