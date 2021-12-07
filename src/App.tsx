import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Home, MintNFT, Details } from "./pages";

function App() {
  return (
    <main className="dark:bg-gray-800 font-mono bg-white relative h-screen">
      <Header />
      <Notice />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/mint-nft' element={<MintNFT />} />
        <Route path="/nft">
          <Route path=":index" element={<Details />} />
        </Route>
      </Routes>
    </main>
  );
}

function Header() {
  return (
    <header className="h-24 flex items-center z-30 w-full">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="uppercase text-gray-800 dark:text-white font-black text-3xl flex items-center">
          <svg width="25" height="25" viewBox="0 0 1792 1792" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M1664 1504v-768q-32 36-69 66-268 206-426 338-51 43-83 67t-86.5 48.5-102.5 24.5h-2q-48 0-102.5-24.5t-86.5-48.5-83-67q-158-132-426-338-37-30-69-66v768q0 13 9.5 22.5t22.5 9.5h1472q13 0 22.5-9.5t9.5-22.5zm0-1051v-24.5l-.5-13-3-12.5-5.5-9-9-7.5-14-2.5h-1472q-13 0-22.5 9.5t-9.5 22.5q0 168 147 284 193 152 401 317 6 5 35 29.5t46 37.5 44.5 31.5 50.5 27.5 43 9h2q20 0 43-9t50.5-27.5 44.5-31.5 46-37.5 35-29.5q208-165 401-317 54-43 100.5-115.5t46.5-131.5zm128-37v1088q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1472q66 0 113 47t47 113z">
            </path>
          </svg>
          <span className="text-xs ml-3 mt-1">
            <a href="mailto:support@aeternalism.com">Aeternalism</a>
          </span>
        </div>
        <div className="flex items-center">
          <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
            <Link to="/" className="py-2 px-6 flex hover:text-black">
              Home
            </Link>
            <Link to="/mint-nft" className="py-2 px-6 flex hover:text-black">
              MagicNFT
            </Link>
          </nav>
          <button className="lg:hidden flex flex-col ml-4">
            <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
            </span>
            <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
            </span>
            <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1">
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Notice() {
  return (
    <div className="bg-pink-600 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-pink-800 dark:bg-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="h-6 w-6 text-white" viewBox="0 0 1792 1792">
                <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                </path>
              </svg>
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">
                Hackathon only!
              </span>
              <span className="hidden md:inline">
                Please install Metamask & Keplr before use!
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
