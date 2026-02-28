"use client"

import { createAppKit } from '@reown/appkit/core'
import { mainnet } from '@reown/appkit/networks'

let modal: any = null

export function getAppKit() {
  if (modal) return modal

  modal = createAppKit({
    projectId: 'b01f86bb575d8820ed3e4337491b9685',
    networks: [mainnet],
    manualWCControl: true
  })

  return modal
}

export async function connectWallet1() {
  const modal = getAppKit()

  modal.open()

  const session = await modal.connect()

  modal.close()

  const accounts = session.namespaces.eip155.accounts

  const address = accounts[0].split(':')[2]

  return address
}