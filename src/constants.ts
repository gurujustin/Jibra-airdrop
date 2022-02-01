export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

interface IAddresses {
  [key: number]: { [key: string]: string };
}
export const addresses: IAddresses = {
  137: {
    BUSD_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    TOKEN_ADDRESS: "0xfCE28BE5df7B09C5ce8Bb47c2f627d8C9F26DeE3",
    PRESALE_ADDRESS: "0x99d6Ef8A48AA752Bb1C2F664D9745D370e14B129",
    AIRDROP_ADDRESS: "0x0B81e26e1A66aA8039Be5932Fba8D9A2FA3dE68e",
  },
};
