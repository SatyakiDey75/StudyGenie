import { useState, useEffect } from "react";
import '../index.css'
import Page from "./Page";
import Loader from "./Components/Loader";
import { AnimatePresence } from 'framer-motion';

export default function App() {

  const [load, setLoad] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setLoad(false);
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    
    <div className="App">
      <AnimatePresence>
        {load && <Loader isExiting={isExiting} />}
      </AnimatePresence>
      {!load && <Page />}
    </div>
  )
}
