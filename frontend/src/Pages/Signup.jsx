import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, store } from "../Context/firebase";
import firebase from 'firebase/compat/app';

export default function Signup() {
  const [pass, setPass] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [alert, setAlert] = useState(false);
  const [avattext, setavattext] = useState("Upload Avatar");
  
  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
  }, [user, nav]);

  const togPass = () => {
    setPass(!pass);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setavattext("Avatar Selected");
    }
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, passw);
      const user = userCredential.user;
      let avatarURL = "";

      if (avatar) {
        const storageRef = store.ref();
        const avatarRef = storageRef.child(`avatars/${user.uid}/${avatar.name}`);
        await avatarRef.put(avatar);
        avatarURL = await avatarRef.getDownloadURL();
      }

      await db.collection('users').doc(user.uid).set({
        username: name,
        email: email,
        avatar: avatarURL
      });

      console.log('User signed up:', user);
      setTimeout(() => {
        nav("/");
      }, 1300);
    } catch (error) {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2500);
      console.error('Error signing up:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      const userDocRef = db.collection('users').doc(user.uid);
      const userDocSnapshot = await userDocRef.get();

      if (!userDocSnapshot.exists) {
        await userDocRef.set({
          username: user.displayName,
          email: user.email,
          avatar: user.photoURL
        });
      }

    } catch (error) {
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 1500);
      console.error('Error signing up:', error);
    }
  };

  return (
    <>
      <div className='max-w-[25em] rounded-sm bg-gradient-to-b from-gray-600 to-gray-900 items-center justify-center align-middle mt-10 mx-auto p-2 shaa my-3'>
        <h1 className='text-center text-3xl pt-4 font-bold text-white'>Sign Up</h1>

        <form className='m-2 px-3' onSubmit={onSubmitHandle}>
          <h2 className='text-xl font-thin my-3 text-white'>Email :</h2>
          <input type='email' className='w-full placeholder:text-pink-500 text-gray-600 border-2 border-solid focus:border-gray-600 focus:ring-0 focus:outline-none h-10 text-center rounded-md' placeholder='example@gmail.com' onChange={(e) => setEmail(e.target.value)} required/>
          <h2 className='text-xl font-thin my-3 text-white'>Username :</h2>
          <input type='text' className='w-full placeholder:text-pink-500 text-gray-600 border-2 border-solid focus:border-gray-600 focus:ring-0 focus:outline-none h-10 text-center rounded-md' placeholder='User Surname' onChange={(e) => setName(e.target.value)} required/>
          <h2 className='text-xl font-thin my-3 text-white'>Password :</h2>
          <div className='flex'>
            <input type={(pass) ? 'text' : 'password'} className='w-full placeholder:text-pink-500 border-2 border-solid focus:border-gray-600 focus:ring-0 focus:outline-none text-gray-600 h-10 text-center rounded-md' placeholder='Enter Password' onChange={(e) => setPassw(e.target.value)} required/>
            {(!pass) ? 
              <svg xmlns="http://www.w3.org/2000/svg" onClick={togPass} className='w-6 ml-3 cursor-pointer' viewBox="0 0 576 512"><path fill="white" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
            : <svg xmlns="http://www.w3.org/2000/svg" onClick={togPass} className='w-6 ml-3 cursor-pointer' viewBox="0 0 640 512"><path fill="white" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
            }
          </div>
          <h2 className='text-xl font-thin my-3 text-white'>Confirm Password :</h2>
          <input type='password' className='w-full placeholder:text-pink-500 text-gray-600 border-2 border-solid focus:border-gray-600 focus:ring-0 focus:outline-none h-10 text-center rounded-md' placeholder='Confirm Password' required/>
          <h2 className="text-xl font-thin my-3 text-white">Choose Avatar :</h2>
          <div className="relative w-full flex justify-center">
              <input type="file" id="file-input" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} required/>
              <button type="button" className="w-full placeholder:text-pink-500 text-pink-500 border-2 border-solid border-gray-600 focus:border-gray-600 focus:ring-0 focus:outline-none h-10 text-center rounded-md bg-white" onClick={() => document.getElementById('file-input').click()}>{avattext}</button>
          </div>
          <button type='submit' className='mx-auto bg-gray-700 transition-all duration-300 hover:bg-gray-600 p-3 text-white rounded-md mt-3'>Create Account</button>
          <hr className='h-1 bg-black my-3' />
        </form>
          <button className='bg-gray-700 mx-auto text-white transition-all duration-300 hover:bg-gray-600 cursor-pointer m-2 px-2 rounded-md text-center flex justify-center' onClick={handleGoogleSignIn}>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-6 m-2 h-auto' viewBox="0 0 326667 333333" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"><path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4"/><path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853"/><path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04"/><path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335"/></svg>
            <h2 className='p-2 font-thin'>Sign Up With Google</h2>
          </button>
        <hr className='h-1 bg-black my-3' />
        <h2 className='p-1 text-center text-white'>Have an account ? <Link to='/signin' className='font-semibold text-white ml-2'>Sign-In</Link></h2>
      </div>
    </>
  );
}
