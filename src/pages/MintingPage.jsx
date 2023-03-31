import React, { useState, useEffect } from "react";

import {
  useAccount,
  useContractReads,
  useContractRead,
  useBalance,
} from "wagmi";

import { ethers } from "ethers";

import MintButton from "../components/MintButton";

import abi from "../assets/abi.json";

function MintingPage() {
  const [mintQ, setMintQ] = useState(0); // mint quantity
  const [reason, setReason] = useState("");
  // const [nonce, setNonce] = useState(0);

  // return;

  const { isConnected, address } = useAccount();
  const { data } = useBalance({ address: address });
  const { totalSupply, priceWei, isMinting, maxSupply } = useTokenDetails();

  const handleMintQChange = (event) => {
    const value = event.target.value;
    // Validate that the input is a number
    if (value == "" || isNaN(value)) setMintQ(0);
    else setMintQ(value);
  };

  useEffect(() => {
    canMint();
  }, [isConnected, mintQ]);

  const canMint = () => {
    const balance = ethers.BigNumber.from(
      ethers.utils.formatUnits(
        ethers.BigNumber.from(data?.value ? data.value : 0),
        "wei"
      )
    );

    let reason = "";
    if (!isConnected) reason += "Connect Wallet. ";
    else {
      if (!isMinting && mintQ != "") reason += "Minting is not active. ";
      if (
        balance.lt(
          ethers.BigNumber.from(priceWei).mul(mintQ ? mintQ : 1000000000)
        )
      )
        reason += "Insufficient Funds. ";
      if (
        ethers.BigNumber.from(totalSupply).add(parseInt(mintQ)) >
        parseInt(maxSupply)
      )
        reason += "Minting too many tokens. ";
      if (mintQ <= 0) reason += "Cannot mint 0 tokens. ";
    }

    setReason(reason);

    return reason == "" ? true : false;
  };

  return (
    <>
      <h1>Minting Page</h1>
      <h2>
        Supply: {totalSupply.toString()}/{maxSupply.toString()}
      </h2>
      <h2>
        Mint Price: {ethers.utils.formatUnits(priceWei, "ether").toString()} ETH
      </h2>
      <h3>
        Your Price:{" "}
        {(
          parseFloat(ethers.utils.formatUnits(priceWei, "ether")) *
          parseFloat(mintQ)
        ).toFixed(3)}{" "}
        ETH
      </h3>
      <input
        type="number"
        min="0"
        onChange={handleMintQChange}
        placeholder="Mint Quantity:"
      ></input>
      {reason == "" && parseInt(mintQ) > 0 && (
        <MintButton mintQ={mintQ} priceWei={priceWei} />
      )}
      {reason != "" && (
        <>
          <button disabled={true}>N/A</button>
          <p>{reason}</p>
        </>
      )}
      {/* {canMint() && <MintButton mintQ={mintQ} priceWei={priceWei} />} */}
    </>
  );
}

export default MintingPage;

const useTokenDetails = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [priceWei, setPriceWei] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [maxSupply, setMaxSupply] = useState(0);

  const tokenContract = {
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi,
  };

  useContractRead({
    ...tokenContract,
    functionName: "totalSupply",
    watch: true,
    onSuccess: (result) => {
      setTotalSupply(ethers.BigNumber.from(result));
    },
  });

  useContractRead({
    ...tokenContract,
    functionName: "priceWei",
    onSuccess: (result) => {
      setPriceWei(ethers.BigNumber.from(result));
    },
  });

  useContractRead({
    ...tokenContract,
    functionName: "isMinting",
    onSuccess: (result) => {
      setIsMinting(result);
    },
  });

  useContractRead({
    ...tokenContract,
    functionName: "MAX_SUPPLY",
    onSuccess: (result) => {
      setMaxSupply(ethers.BigNumber.from(result));
    },
  });

  return { totalSupply, priceWei, isMinting, maxSupply };
};
