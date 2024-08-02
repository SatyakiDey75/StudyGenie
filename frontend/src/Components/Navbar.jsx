import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "../Context/firebase"

export default function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avat, setavat] = useState("")
  const [name, setname] = useState("")
  const [user, setUser] = useState(null); 


  const nav = useNavigate();

  const handlelogout = () => {
    auth.signOut()
    .then(() => {
      setUser(null);
      setavat("")
      nav('/signup');
    })
    .catch((error) => {
      console.error('Error while logging out:', error);
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = db.collection('users').doc(currentUser.uid);
  
        try {
          const userDoc = await userRef.get();
          const userData = userDoc.data();

          setavat(userData.avatar)
          
          if (!currentUser.displayName) {
            setname(userData.username);
          } else {
            setname(currentUser.displayName);
          }

        } catch (error) {
          console.error('Error fetching user document: ', error);
        }
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    if (user) {
      nav('/'); 
    }
  }, [user]);

  return (
    <>
   <header className="z-[588] bg-transparent relative flex items-center justify-between w-screen px-8 py-4">
  <Link to="/" className="flex items-center space-x-2">
    <img src="./favicon.ico" className="w-6 h-6" alt="favicon" />
    <h2 className="font-extrabold lg:text-[1.3em] text-[1em] text-[#1a2b3b]">
      EXTRACTO
    </h2>
  </Link>
  <div className="flex items-center space-x-4">
    {user ? (
      <div className="flex items-center space-x-2">
        <button
          onClick={handlelogout}
          className="inline-flex border border-gray-300 h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:scale-105 duration-200"
        >
          Log out
        </button>
        <img src={avat} className="w-10 h-10 mx-2 rounded-full" alt="avatar" />
      </div>
    ) : (
      <Link
        to="/signup"
        className="inline-flex border border-gray-300 h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-all hover:scale-105 duration-200"
      >
        Sign In
      </Link>
    )}
  </div>
</header>

    </>
  );
}