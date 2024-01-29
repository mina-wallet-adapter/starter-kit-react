import React, { ReactNode, useState } from "react";
import {
  WalletProvider,
  WalletMultiButton,
  useWallet,
} from "@mina-wallet-adapter/ui-react";
import "@mina-wallet-adapter/ui-react/dist/wallet-adapter.css";
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
  return <WalletProvider autoConnect={true}>{children}</WalletProvider>;
}

function Content() {
  const [value] = useState(0);
  const { connected } = useWallet();

  function submit() {
    alert("This feature is WIP.");
  }

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
            <>
              <p>
                On-chain state: <strong>{value}</strong>
              </p>
              <p>Click below button to add 2 to the on-chain state.</p>
              <button
                className="wallet-adapter-button wallet-adapter-button-trigger"
                onClick={submit}
              >
                Add 2
              </button>
            </>
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
