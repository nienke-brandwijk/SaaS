import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-white">
        
      <header className="w-full flex justify-between items-center py-6 px-8 bg-stone-100">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="text-orange-700 text-2xl font-bold">Mijn Header</h1>
        </div>

        {/* Navigation */}
        <nav className="flex divide-x divide-orange-700 uppercase">
          {["Learn", "Create", "Dictionary", "Calculator", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="w-[110px] text-center text-orange-700 hover:underline hover:font-bold"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Sign in */}
        <div>
          <button className="border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-white uppercase">
            Sign in
          </button>
        </div>
      </header>

    </div>
  );
};

export default Navbar;