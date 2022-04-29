import bondsterLogo from '../assets/bondster.png';
import esketitLogo from '../assets/esketit.ico';
import estateGuruLogo from '../assets/estateguru.png';
import getIncomeLogo from '../assets/getincome.ico';
import lendermarketLogo from '../assets/lendermarket.png';
import lendsecuredLogo from '../assets/lendsecured.png';
import peerBerryLogo from '../assets/peerberry.png';
import solanaLogo from '../assets/solana.png';
import atomLogo from '../assets/atom.ico';
import kavaLogo from '../assets/kava.png';
import terraLogo from '../assets/terra.png';
import osmosisLogo from '../assets/osmosis.ico';
import croLogo from '../assets/cro.png';
import React from 'react';

const types = [
  {name: 'Bondster', type: 'Bondster', category: 'P2P'},
  {name: 'EstateGuru', type: 'EstateGuru', category: 'P2P'},
  {name: 'Esketit', type: 'Esketit', category: 'P2P'},
  {name: 'GetIncome', type: 'GetIncome', category: 'P2P'},
  {name: 'Lendermarket', type: 'Lendermarket', category: 'P2P'},
  {name: 'LendSecured', type: 'LendSecured', category: 'P2P'},
  {name: 'PeerBerry', type: 'PeerBerry', category: 'P2P'},
  {name: 'Solana', type: 'Solana', category: 'CRYPTO'},
  {name: 'KAVA', type: 'KAVA', category: 'CRYPTO'},
  {name: 'ATOM', type: 'ATOM', category: 'CRYPTO'},
  {name: 'LUNA', type: 'LUNA', category: 'CRYPTO'},
  {name: 'Osmosis', type: 'OSMO', category: 'CRYPTO'},
  {name: 'Crypto.com', type: 'CRO', category: 'CRYPTO'},
];

export const getAccountTypes = () => {
  return types;
};

export const getCategoryByType = (type) => {
  for (let i = 0; i < types.length; i++) {
    if (types[i].type === type) {
      return types[i].category;
    }
  }
  return 'P2P';
};

export const toEuro = (amount) => {
  if (!amount) {
    amount = 0;
  }
  return amount.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
};

export const getSafeNumber = (num) => {
  if (num == undefined || num == null) {
    return 0;
  } else {
    return num;
  }
};

export const toFixed = (amount) => {
  if (!amount) {
    amount = 0;
  }
  return amount.toFixed(8);
};

export const getIconByAccountType = (type) => {
  switch (type) {
    case 'GetIncome':
      return <img width="24" height="24" src={getIncomeLogo} alt="GetIncome" />;
    case 'LendSecured':
      return <img width="24" height="24" src={lendsecuredLogo} alt="LendSecured" />;
    case 'Lendermarket':
      return <img width="24" height="24" src={lendermarketLogo} alt="Lendermarket" />;
    case 'PeerBerry':
      return <img width="24" height="24" src={peerBerryLogo} alt="PeerBerry" />;
    case 'Bondster':
      return <img width="24" height="24" src={bondsterLogo} alt="Bondster" />;
    case 'EstateGuru':
      return <img width="24" height="24" src={estateGuruLogo} alt="EstateGuru" />;
    case 'Esketit':
      return <img width="24" height="24" src={esketitLogo} alt="Esketit" />;
    case 'Solana':
      return <img width="24" height="24" src={solanaLogo} alt="Solana" />;
    case 'ATOM':
      return <img width="24" height="24" src={atomLogo} alt="ATOM" />;
    case 'KAVA':
      return <img width="24" height="24" src={kavaLogo} alt="KAVA" />;
    case 'LUNA':
      return <img width="24" height="24" src={terraLogo} alt="LUNA" />;
    case 'OSMO':
      return <img width="24" height="24" src={osmosisLogo} alt="OSMO" />;
    case 'CRO':
      return <img width="24" height="24" src={croLogo} alt="OSMO" />;
    default:
      return null;
  }
};
