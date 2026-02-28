"use client"

import { createAppKit } from '@reown/appkit/core'
import { mainnet } from '@reown/appkit/networks'

let appKit: any = null

export function getAppKit() {
  if (!appKit) {
    appKit = createAppKit({
      projectId: 'b01f86bb575d8820ed3e4337491b9685',
      networks: [mainnet],
      manualWCControl: true
    })
  }
  return appKit
}

export async function connectWallet1() {
  const modal = getAppKit()
  alert('welcome')
  // IMPORTANT: explicitly open modal
  modal.open()

  try {
    const session = await modal.connect()

    modal.close()

    const accounts = session.namespaces.eip155.accounts

    const address = accounts[0].split(':')[2]

    return address

  } catch (err) {
    modal.close()
    alert('errr')
    alert(err)
    throw err
  }
}