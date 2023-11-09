/**
 * @DEV: If the sandbox is throwing dependency errors, chances are you need to clear your browser history.
 * This will trigger a re-install of the dependencies in the sandbox – which should fix things right up.
 * Alternatively, you can fork this sandbox to refresh the dependencies manually.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { getProvider, signMessage, signPSBT } from './utils';

import { BtcAccount, TLog } from './types';

import { Logs, Sidebar, NoProvider } from './components';

// =============================================================================
// Styled Components
// =============================================================================

const StyledApp = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// =============================================================================
// Constants
// =============================================================================

const provider = getProvider();
const message = 'To avoid digital dognappers, sign below to authenticate with CryptoCorgis.';

// =============================================================================
// Typedefs
// =============================================================================

export type ConnectedMethods = {
  name: string;
  onClick: () => Promise<any>;
};

interface Props {
  connectedAccount: BtcAccount[];
  connectedMethods: ConnectedMethods[];
  handleConnect: () => Promise<void>;
  logs: TLog[];
  clearLogs: () => void;
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * @DEVELOPERS
 * The fun stuff!
 */
const useProps = (): Props => {
  const [logs, setLogs] = useState<TLog[]>([]);

  const createLog = useCallback(
    (log: TLog) => {
      return setLogs((logs) => [...logs, log]);
    },
    [setLogs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  const [connectedAccount, setConnectedAccount] = useState([]);

  useEffect(() => {
    if (!provider) return;

    // attempt to eagerly connect
    provider.requestAccounts().catch(() => {
      // fail silently
    });

    provider.on('accountsChanged', (accounts: BtcAccount[]) => {
      setConnectedAccount(accounts);
      if (accounts.length > 0) {
        createLog({
          status: 'success',
          method: 'requestAccounts',
          message: `Connected to account ${JSON.stringify(accounts)}`,
        });
      } else {
        createLog({
          status: 'warning',
          method: 'requestAccounts',
          message: '👋',
        });
      }
    });

    return () => {};
  }, [createLog]);

  /** Connect */
  const handleConnect = useCallback(async () => {
    if (!provider) return;
    console.log(provider);

    try {
      await provider.requestAccounts();
    } catch (error) {
      createLog({
        status: 'error',
        method: 'requestAccounts',
        message: error.message,
      });
    }
  }, [createLog]);

  /** Sign Message */
  const handleSignMessage = useCallback(async () => {
    if (!provider) return;
    try {
      const { signedMessage, signature } = await signMessage(provider, message);
      createLog({
        status: 'success',
        method: 'signMessage',
        message: `Message signed: ${JSON.stringify(signedMessage)}`,
      });
      return { signedMessage, signature };
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [createLog]);

  /** Sign PSBT */
  const handleSignPSBT = useCallback(async () => {
    if (!provider) return;
    try {
      const signedTransaction = await signPSBT(provider, 'hello');
      createLog({
        status: 'success',
        method: 'signPSBT',
        message: `Message signed: ${JSON.stringify(signedTransaction)}`,
      });
      return signedTransaction;
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signPSBT',
        message: error.message,
      });
    }
  }, [createLog]);

  const connectedMethods = useMemo(() => {
    return [
      {
        name: 'Sign Message',
        onClick: handleSignMessage,
      },
      {
        name: 'Sign PSBT',
        onClick: handleSignPSBT,
      },
    ];
  }, [handleSignMessage, handleSignPSBT]);

  return {
    connectedAccount,
    connectedMethods,
    handleConnect,
    logs,
    clearLogs,
  };
};

// =============================================================================
// Stateless Component
// =============================================================================

const StatelessApp = React.memo((props: Props) => {
  const { connectedAccount, connectedMethods, handleConnect, logs, clearLogs } = props;

  return (
    <StyledApp>
      <Sidebar connectedAccount={connectedAccount} connectedMethods={connectedMethods} connect={handleConnect} />
      <Logs connectedAccount={connectedAccount} logs={logs} clearLogs={clearLogs} />
    </StyledApp>
  );
});

// =============================================================================
// Main Component
// =============================================================================

const App = () => {
  const props = useProps();

  if (!provider) {
    return <NoProvider />;
  }

  return <StatelessApp {...props} />;
};

export default App;
