import React from "react";
import { Link } from "react-router-dom";

import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <nav>
      <ul style={{ listStyle: "none" }}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/minting">Minting</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <ConnectButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
