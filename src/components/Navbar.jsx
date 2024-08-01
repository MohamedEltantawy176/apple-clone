import { appleImg, bagImg, searchImg } from "../utils";
import { navLists } from "../constants/index";

const Navbar = () => {
  return (
    <header className="w-full py-5 px-5 lg:px-10 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        <img
          src={appleImg}
          alt="Apple"
          width={14}
          height={18}
          className="absolute bottom-1 "
        />
        <div className="flex flex-1 justify-center max-lg:hidden">
          {navLists.map((nav, i) => (
            <div
              className="px-5 text-xs cursor-pointer text-gray hover:text-white transition-all"
              key={i}
            >
              {nav}
            </div>
          ))}
        </div>
        <div className="flex items-baseline gap-7 max-lg:justify-end max-lg:flex-1">
          <img src={searchImg} alt="search" width={18} height={18} />
          <img src={bagImg} alt="bag" width={18} height={18} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
