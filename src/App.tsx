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
const hexString =
  '70736274ff0100fd940102000000048a841e4104389e3b5b04c1522ed7bfc0e64c3760cb801a2ee2406d1c2373d81d0300000000ffffffff8a841e4104389e3b5b04c1522ed7bfc0e64c3760cb801a2ee2406d1c2373d81d0400000000ffffffffaf3341cffbd7ce8b4a51dec0f358a21809fad67be1a11bf70b86e83ec4567ace0100000000ffffffff8eceb072b7c47ebd9c1aa2e17c2541145835c70a8667eb21fa2ff3cac503170e0600000000ffffffff07b004000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed04a01000000000000225120b1a548f1672b6bc666e23943b0b138a4216e2ce5f9bc687469e0f52a917bbf274b0100000000000017a91433ab469b293fa7700f0954c96ec630895892f189874402000000000000160014c015c65276d5f38d599d445c4cb03aa7aa0dc3655802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed072fe050000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed000000000000100fdf50102000000000101a1f8bb2bde4e13b2f397a82a8a101b378e90af13354710b93742be79b773e3840000000000ffffffff0b5802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed00d4c070000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed00247304402204d2e9da8a14537a1c37b59e6a7eb828816249747dbec041315ade14a181c826a022044dcc381227cef6ab18431e692dccc7c27e2a10fed4d3131e0523094819d1dda0121028b8437ac47a4434d4b86d19ab7eeb255887f75cfa43ca135168bfc8281ae8bb90000000001011f5802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed0000100fdf50102000000000101a1f8bb2bde4e13b2f397a82a8a101b378e90af13354710b93742be79b773e3840000000000ffffffff0b5802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed00d4c070000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed00247304402204d2e9da8a14537a1c37b59e6a7eb828816249747dbec041315ade14a181c826a022044dcc381227cef6ab18431e692dccc7c27e2a10fed4d3131e0523094819d1dda0121028b8437ac47a4434d4b86d19ab7eeb255887f75cfa43ca135168bfc8281ae8bb90000000001011f5802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed0000100fd6f0302000000000104a81c37519eca22bd78a4705230dcc471fb59f285bb2f22165c803de5bbe10b4c08000000171600147e3a872889766d0e3aebacf19f7936fd659b2605ffffffffa81c37519eca22bd78a4705230dcc471fb59f285bb2f22165c803de5bbe10b4c03000000171600147e3a872889766d0e3aebacf19f7936fd659b2605ffffffff33ec9dbdfa3ecb3654683b54855eac430d41b9b87b028f8cc84c6766bf7cc3870100000000ffffffff14e64f84c47029f5b8687519707c6e18080f675f37323746c695a681b0fdfece06000000171600147e3a872889766d0e3aebacf19f7936fd659b2605ffffffff07b00400000000000017a91433ab469b293fa7700f0954c96ec630895892f189874a01000000000000225120a9af1fae42dbe9b0604e0ed64ae6e26d56d1c9bbcc4e1e66326914bdb5149606591a000000000000225120cfb72754409e197bce4ea0670bd4f977104bcc86f7ea65d8981609dc66e984454402000000000000160014c015c65276d5f38d599d445c4cb03aa7aa0dc365580200000000000017a91433ab469b293fa7700f0954c96ec630895892f18987580200000000000017a91433ab469b293fa7700f0954c96ec630895892f18987d8c300000000000017a91433ab469b293fa7700f0954c96ec630895892f189870247304402204c291efdec8e7442aef45ad4751938ae21b847bedde8ce8c9eb208f7a29537880220247a6767215d12c0c5ebc751b6386c50c3a9d5ba0792e0396e2ae420b736a5ab0121032765788cbacba654f3cdf679026db3cdb5a5d0310f870f4da223926a2813259902483045022100bceed8f98e1fbed310cfc01e2bdd3dcbd146064c6fc9d423e787367602d8df7c02204e300e2c9e6c4be50f2c9db54c2f6aeb5eae1897db38bf6406f16ee2e3de4f5e0121032765788cbacba654f3cdf679026db3cdb5a5d0310f870f4da223926a2813259901414045d5e077660865bde16a0af320b426f636b49ea7674f1cc1a9d7c86643638cdbb21c9a281c79aeaa118d833840eca4ec0b3cc6a807f1900bb7395ab4eb72ff830247304402204fdc2e31b88b42081c42dc6c249297aeffe1147071fa6994f95ded6257d93d9602205bf9c30fc7cf0d2b78a1e0027e1cc4eae6e45aef7281017fac932058ee1674d70121032765788cbacba654f3cdf679026db3cdb5a5d0310f870f4da223926a281325990000000001012b4a01000000000000225120a9af1fae42dbe9b0604e0ed64ae6e26d56d1c9bbcc4e1e66326914bdb51496060117207f003df863d4c17579f7b22f7498e39525b81c947aef234859b0466d3dd8dfb3000100fd2603020000000001048a841e4104389e3b5b04c1522ed7bfc0e64c3760cb801a2ee2406d1c2373d81d0800000000ffffffff8a841e4104389e3b5b04c1522ed7bfc0e64c3760cb801a2ee2406d1c2373d81d0500000000ffffffff9584f0b205109f6790fbf08f782166892f22facb8e2598b705cd9136b25aabc30000000000ffffffff4f4b0bbc053b9e3cb6261cb83c063481eba8a8a32a448c63f1c1218d6fe330380600000000ffffffff07b004000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed02202000000000000225120b1a548f1672b6bc666e23943b0b138a4216e2ce5f9bc687469e0f52a917bbf2775120000000000002251208ef171ead3a8f91d9dca9ae4b645537aafada16559f9f714cbe524ef672ab4144402000000000000160014c015c65276d5f38d599d445c4cb03aa7aa0dc3655802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed05802000000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed04057060000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed002483045022100a5cf71b0115db7980055fa9158c24fca9e3cc09cca0d1a0c54f17e8fa92d3e2402201b7dce27ff09e06c40a87b54aa2db693f49291e2f1a32f055155a3750607d01e0121028b8437ac47a4434d4b86d19ab7eeb255887f75cfa43ca135168bfc8281ae8bb902473044022049edbc2650ed737bad10d567c072da54c6b592fcfe2240fabcd49d8aa176422102206c8101ba6f8d6a155ed916ca7b25bf69395d76c020cb6ed9cf8293d65870346e0121028b8437ac47a4434d4b86d19ab7eeb255887f75cfa43ca135168bfc8281ae8bb901410a4a56764a5f9ed3fee4a869f6edee7b9b72f87bdba96d08310191a6df94bcf56f32152e63a836844cea71611886e3f96f74a2cc06d88ddf508184857f5fb4138302473044022075b779781668f4a487c2308aca9217125b897d089f617d831122612db02a672402200ef61ec6ddb6cac999e528e9e4fe27acb0a1cba4f8b33204b180ee458a8d82790121028b8437ac47a4434d4b86d19ab7eeb255887f75cfa43ca135168bfc8281ae8bb90000000001011f4057060000000000160014b2c9b35e4b02e8b16236ae5c0540cf2d56605ed00000000000000000';

// =============================================================================
// Typedefs
// =============================================================================

export type ConnectedMethods = {
  name: string;
  onClick: () => Promise<any>;
};

interface Props {
  connectedAccounts: BtcAccount[];
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

  const [connectedAccounts, setConnectedAccounts] = useState([]);

  useEffect(() => {
    if (!provider) return;

    // attempt to eagerly connect
    provider.requestAccounts().catch(() => {
      // fail silently
    });

    provider.on('accountsChanged', (accounts: BtcAccount[]) => {
      setConnectedAccounts(accounts);
      if (accounts.length > 0) {
        createLog({
          status: 'success',
          method: 'requestAccounts',
          message: `Connected to accounts: ${JSON.stringify(accounts)}`,
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
    if (!provider || !connectedAccounts[0]) return;
    try {
      const address = connectedAccounts[0].address;
      const { signature } = await signMessage(provider, address, message);
      createLog({
        status: 'success',
        method: 'signMessage',
        message: `Message signed by ${address}: ${JSON.stringify(signature)}`,
      });
      return signature;
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signMessage',
        message: error.message,
      });
    }
  }, [connectedAccounts, createLog]);

  /** Sign PSBT */
  const handleSignPSBT = useCallback(async () => {
    if (!provider || !connectedAccounts[0]) return;
    try {
      const address = connectedAccounts[0].address;
      const signedTransaction = await signPSBT(provider, address, hexString);
      createLog({
        status: 'success',
        method: 'signPSBT',
        message: `Signed PSBT: ${signedTransaction}`,
      });
      return signedTransaction;
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signPSBT',
        message: error.message,
      });
    }
  }, [connectedAccounts, createLog]);

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
    connectedAccounts,
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
  const { connectedAccounts, connectedMethods, handleConnect, logs, clearLogs } = props;

  return (
    <StyledApp>
      <Sidebar connectedAccounts={connectedAccounts} connectedMethods={connectedMethods} connect={handleConnect} />
      <Logs connectedAccounts={connectedAccounts} logs={logs} clearLogs={clearLogs} />
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
