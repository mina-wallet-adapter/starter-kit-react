import React, { ReactNode, useState, useMemo, useCallback } from "react";
import { MINA_BERKELEY_CHAIN } from "mina-wallet-standard";
import {
  AdapterId,
  WalletProvider,
  WalletMultiButton,
  useWallet,
} from "@mina-wallet-adapter/ui-react";
import "@mina-wallet-adapter/ui-react/dist/wallet-adapter.css";
import * as zk from "./zkapp";
import "./App.css";

export default App;

function App() {
  return (
    <AppContext>
      <Content />
    </AppContext>
  );
}

function AppContext({ children }: { children: ReactNode }) {
  const adapters = useMemo(
    () => [AdapterId.AURO, AdapterId.LEDGER, AdapterId.METAMASK_SNAP],
    []
  );

  return (
    <WalletProvider adapters={adapters} autoConnect={true}>
      {children}
    </WalletProvider>
  );
}

function Content() {
  const { connected } = useWallet();

  return (
    <main>
      <header>
        <p className="callout">
          Get started by editing <b>ui/src/App.tsx</b>
        </p>
        <div>
          <WalletMultiButton />
        </div>
      </header>

      <section>
        <h1>
          zkApp Starter-Kit with <i>React</i>
        </h1>
        <p>
          This is a project template for creating zkApps built with{" "}
          <a
            href="https://github.com/mina-wallet-adapter/wallet-adapter"
            target="_blank"
            rel="noreferrer"
          >
            <b>mina-wallet-adapter</b>
          </a>
          , <b>o1js</b>, <b>React</b> and <b>create-react-app</b>.
        </p>

        <div className="callout">
          {connected ? (
            <ContentAfterConnection />
          ) : (
            <>
              <p className="warning">No wallet connected</p>
              <p>
                Click on the <b>Connect Wallet</b> button above to connect.
              </p>
            </>
          )}
        </div>
      </section>

      <footer className="callout">
        <h2>Next steps ...</h2>
        <p>
          - Learn more about Mina Wallet Adapter features, components and hooks
          from the{" "}
          <a
            href="https://mina-wallet-adapter.github.io/wallet-adapter/"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
          .
        </p>
        <p>
          - Explore this{" "}
          <a
            href="https://github.com/mina-wallet-adapter/starter-kit-react"
            target="_blank"
            rel="noreferrer"
          >
            starter template
          </a>{" "}
          code on GitHub.
        </p>
      </footer>
    </main>
  );
}

function ContentAfterConnection() {
  const { name, chain, publicKey, signAndSendTransaction } = useWallet();
  const [value, setValue] = useState(0);
  const [txnId, setTxnId] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const zkInitialized = useMemo(() => {
    zk.initContract();
    return true;
  }, [zk]);

  const getValue = useCallback(async () => {
    const value = await zk!.getOnChainValue();
    setValue(value);
  }, [zkInitialized, zk]);

  const submit = useCallback(
    async (e: { currentTarget: any }) => {
      const button = e.currentTarget;

      try {
        setTxnId("");
        button.disabled = true;
        button.style.cursor = "wait";
        document.body.style.cursor = "wait";

        setStatusMsg(
          "Compiling zkApp contract ... (This might take several minutes)"
        );
        await zk!.compileContract();

        setStatusMsg(
          "Creating transaction ... (This might take several minutes)"
        );
        const txn = await zk!.createTransaction(publicKey!);

        setStatusMsg("Signing transaction ...");
        const hash = await signAndSendTransaction(txn.toJSON());
        setTxnId(hash!);

        setStatusMsg(
          "Waiting for transaction to be included in a block ... (This might take several minutes)"
        );
        await zk!.waitTransaction(txnId!);

        await getValue();
      } catch (error: any) {
        console.log("Error:", error.message);
        alert("Error: " + error.message);
      } finally {
        setStatusMsg("");
        document.body.style.cursor = "";
        button.style.cursor = "";
        button.disabled = false;
      }
    },
    [publicKey, signAndSendTransaction, zk]
  );

  return (
    <>
      {chain === MINA_BERKELEY_CHAIN ? (
        <>
          {value ? (
            <p>loading ...</p>
          ) : (
            <>
              <p>
                <span className="mr-2">
                  Chain: <strong>{chain}</strong>
                </span>
                <span>
                  On-chain state: <strong>{value}</strong>
                </span>
              </p>
              <p>Click below button to add 2 to the on-chain state.</p>
              <button
                className="wallet-adapter-button wallet-adapter-button-trigger"
                onClick={submit}
              >
                Add 2
              </button>
              {txnId && <p>Transaction ID: {txnId}</p>}
              {statusMsg && <p className="warning">{statusMsg}</p>}
            </>
          )}
        </>
      ) : (
        <>
          <p className="warning">You are connected to {chain}</p>
          <p>Switch to Berkeley chain on {name} wallet.</p>
        </>
      )}
    </>
  );
}
