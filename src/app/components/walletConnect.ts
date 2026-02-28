import UniversalProvider from '@walletconnect/universal-provider'
import { createAppKit } from '@reown/appkit/core'
import { mainnet } from '@reown/appkit/networks'

export const provider = await UniversalProvider.init({
  projectId: 'b01f86bb575d8820ed3e4337491b9685',
  metadata: {
    name: 'My Website',
    description: 'My Website Description',
    url: window.location.origin,
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
})

export const modal = createAppKit({
  projectId: 'b01f86bb575d8820ed3e4337491b9685',
  networks: [mainnet],
  universalProvider: provider,
  manualWCControl: true
})

export async function connectWallet1() {
  try {
    // open QR / wallet modal
    modal.open()

    await provider.connect({
      optionalNamespaces: {
        eip155: {
          methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData'
          ],
          chains: ['eip155:1'],
          events: ['chainChanged', 'accountsChanged']
        }
      }
    })

    modal.close()

    const accounts = provider.session?.namespaces?.eip155?.accounts

    if (!accounts?.length) throw new Error("No account connected")

    const address = accounts[0].split(':')[2]

    return address

  } catch (err) {
    modal.close()
    throw err
  }
}