import React from "react";
import abi from "../assets/abi.json";
import { ethers } from "ethers";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

const MintButton = (props) => {
  const { config } = usePrepareContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: abi,
    functionName: "mintTokens",
    args: [props.mintQ],
    overrides: {
      value: ethers.BigNumber.from(props.priceWei).mul(props.mintQ),
    },
  });

  const {
    data: txnData,
    isLoading: isTxnLoading,
    isSuccess: isTxnStarted,
    write: mintTokens,
  } = useContractWrite(config);

  const { isSuccess: isTxnSuccess } = useWaitForTransaction({
    hash: txnData?.hash,
  });

  return (
    <>
      <button
        disabled={
          !mintTokens || ((isTxnLoading || isTxnStarted) && !isTxnSuccess)
        }
        onClick={() => mintTokens?.()}
      >
        Mint {props.mintQ} {parseInt(props.mintQ) == 1 ? "Token" : "Tokens"}
      </button>
      {isTxnLoading && <div>Check Wallet</div>}
      {isTxnStarted && !isTxnSuccess && (
        <div>Transaction Pending... {txnData.hash}</div>
      )}
      {isTxnSuccess && <div>Transaction Success! {txnData.hash}</div>}
    </>
  );
};

export default MintButton;
