{
    "name": "John Doe",
    "programName": "Computer Science",
    "grade": "90"
}

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFT from './contracts/MyNFT.json';

function App() {
  const [nftContract, setNftContract] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchProgram, setSearchProgram] = useState('');

  useEffect(() => {
    const connectToBlockchain = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const contractAddress = MyNFT.networks[network.chainId].address;
      const contract = new ethers.Contract(contractAddress, MyNFT.abi, signer);
      setNftContract(contract);
      const certificateIds = await contract.tokensOfOwner(signer.getAddress());
      const certificates = await Promise.all(certificateIds.map(async (id) => {
        const tokenUri = await contract.tokenURI(id);
        const response = await fetch(tokenUri);
        const data = await response.json();
