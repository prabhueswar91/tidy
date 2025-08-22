// config/wagmi.ts
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet } from "@reown/appkit/networks";

export const projectId = "YOUR_PROJECT_ID"; // from reown dashboard

if (!projectId) throw new Error("Reown projectId missing");

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks: [mainnet], // only Ethereum mainnet
});

export const config = wagmiAdapter.wagmiConfig;
