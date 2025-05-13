import { useState, useEffect, useRef } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "This user does not exist. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "This email is already in use. Please use a different email.";
      case "auth/weak-password":
        return "Password is too weak. Please use a stronger password.";
      case "auth/invalid-email":
        return "Invalid email address. Please enter a valid email.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowModal(false);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      setShowModal(false);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(getErrorMessage(err.code));
    }
  };

  const openModal = (signUp = false) => {
    setIsSignUp(signUp);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400 tracking-tight">InternSight</h1>
            </div>
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <p className="text-gray-300 font-medium">Welcome, {user.displayName || user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition font-medium"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openModal(false)}
                    className="text-blue-400 hover:text-blue-300 transition font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openModal(true)}
                    className="text-green-400 hover:text-green-300 transition font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Landing Section */}
      <section className="flex flex-col items-center justify-center flex-1 py-20 bg-gray-900">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-center leading-tight tracking-tight">
          Organize Your Internship Applications with InternSight
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 text-center max-w-2xl leading-relaxed">
          InternSight helps you track your internship applications, monitor status updates, and stay organized with a simple, intuitive interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={() => openModal(false)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
          <button
            onClick={() => openModal(true)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            Sign Up
          </button>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-gray-700 transition transform hover:scale-105">
              <svg className="w-12 h-12 text-blue-400 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 17v-2a4 4 0 0 1 4-4h4" />
                <circle cx="9" cy="7" r="4" />
                <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              <h3 className="text-xl font-semibold mb-3 text-white">Track Applications</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Keep all your internship applications in one place and never miss a deadline.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-gray-700 transition transform hover:scale-105">
              <svg className="w-12 h-12 text-green-400 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold mb-3 text-white">Status Updates</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Easily update and view the status of each application as you progress.
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center hover:bg-gray-700 transition transform hover:scale-105">
              <svg className="w-12 h-12 text-purple-400 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              <h3 className="text-xl font-semibold mb-3 text-white">Simple UI</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Enjoy a clean and intuitive user interface designed for ease of use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          style={{
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <div
            ref={modalRef}
            className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md mx-4"
            style={{
              animation: 'fadeIn 0.3s ease-in-out'
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? "Sign Up" : "Sign In"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-300 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {error && <p className="text-red-400 mb-4 font-medium">{error}</p>}
            <form className="space-y-5">
              {isSignUp && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={isSignUp ? handleRegister : handleSignIn}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;