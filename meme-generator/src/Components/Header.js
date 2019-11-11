import React from "react";

const trollFace = require("../Images/Trollface.png");

const Header = () => {
  return (
    <header>
      <div className='imgContainer'>
        <img
          src={trollFace}
          alt="Problem?"
        />
      </div>
      <div className='titleContainer'>
        <p>Meme Generator</p>
      </div>
    </header>
  );
};

export default Header;
