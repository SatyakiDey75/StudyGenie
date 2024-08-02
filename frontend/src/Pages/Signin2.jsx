/**
 * v0 by Vercel.
 * @see https://v0.dev/t/G0EHs0pRpse
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { Link } from "react-router-dom"

export default function Component() {
  return (
    <div className="flex w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="w-1/2 bg-[#00C48C] p-8 rounded-l-lg text-white">
        <h2 className="text-3xl font-bold mb-4">Simple, Free Investing.</h2>
        <p className="mt-auto mb-4">SGBs</p>
      </div>
      <div className="w-1/2 p-8">
        <div className="flex justify-end">
          <button className="text-gray-500">
            <DoorClosedIcon className="h-6 w-6" />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6">Welcome to Groww</h2>
        <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg mb-4">
          <ChromeIcon className="h-6 w-6 mr-2" />
          Continue with Google
        </button>
        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">
            Your Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button className="w-full bg-[#00C48C] text-white py-2 rounded-lg">Continue</button>
        <p className="mt-4 text-center text-sm text-gray-500">
          By proceeding, I agree to{" "}
          <Link href="#" className="underline" prefetch={false}>
            T&C
          </Link>
          ,{" "}
          <Link href="#" className="underline" prefetch={false}>
            Privacy Policy
          </Link>{" "}
          &{" "}
          <Link href="#" className="underline" prefetch={false}>
            Tariff Rates
          </Link>
        </p>
      </div>
    </div>
  )
}

function ChromeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}


function DoorClosedIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
      <path d="M2 20h20" />
      <path d="M14 12v.01" />
    </svg>
  )
}