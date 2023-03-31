import { Route, Routes } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, arbitrumGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MintingPage from "./pages/MintingPage";
import Navbar from "./components/Navbar";
import "./App.css";

const { chains, provider } = configureChains(
  [arbitrumGoerli, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "EVM721XP",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/minting" element={<MintingPage />} />
          </Routes>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
