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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-400">InternSight</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <p className="text-gray-300">Welcome, {user.displayName || user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openModal(false)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openModal(true)}
                    className="text-green-400 hover:text-green-300 transition"
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
      <section className="flex flex-col items-center justify-center flex-1 py-16 bg-gray-900">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 text-center">
          Organize Your Internship Applications with InternSight
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 text-center max-w-2xl">
          InternSight helps you track your internship applications, monitor status updates, and stay organized with a simple, intuitive interface.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => openModal(false)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => openModal(true)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
        {/* Features Section */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:bg-gray-700 transition">
              <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 17v-2a4 4 0 0 1 4-4h4" />
                <circle cx="9" cy="7" r="4" />
                <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-white">Track Applications</h3>
              <p className="text-gray-300 text-center">
                Keep all your internship applications in one place and never miss a deadline.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:bg-gray-700 transition">
              <svg className="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-white">Status Updates</h3>
              <p className="text-gray-300 text-center">
                Easily update and view the status of each application as you progress.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:bg-gray-700 transition">
              <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-white">Simple UI</h3>
              <p className="text-gray-300 text-center">
                Enjoy a clean and intuitive user interface designed for ease of use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out scale-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
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
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={isSignUp ? handleRegister : handleSignIn}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
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