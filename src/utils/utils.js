const types = [
  { name: "Bondster", type: "Bondster", category: "P2P" },
  { name: "EstateGuru", type: "EstateGuru", category: "P2P" },
  { name: "Esketit", type: "Esketit", category: "P2P" },
  { name: "GetIncome", type: "GetIncome", category: "P2P" },
  { name: "Lendermarket", type: "Lendermarket", category: "P2P" },
  { name: "LendSecured", type: "LendSecured", category: "P2P" },
  { name: "PeerBerry", type: "PeerBerry", category: "P2P" },
  { name: "Solana", type: "Solana", category: "CRYPTO" },
  { name: "KAVA", type: "KAVA", category: "CRYPTO" },
  { name: "ATOM", type: "ATOM", category: "CRYPTO" },
  { name: "LUNA", type: "LUNA", category: "CRYPTO" },
];

export const getAccountTypes = () => {
  return types;
};

export const getCategoryByType = (type) => {
  for (var i = 0; i < types.length; i++) {
    if (types[i].type === type) {
      return types[i].category;
    }
  }
  return "P2P";
};
