import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const SpotifyClone = () => {
  const [userAddress, setUserAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const spotifyCloneAddress = '0x19DbEE7bE2e97E02941732169372B6d810a4a081';

  useEffect(() => {
   
    async function connectToBlockchain() {
      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

       
        const address = await signer.getAddress();
        setUserAddress(address);

       
        const balance = await provider.getBalance(address);
        setEthBalance(balance);

       
        const hasAccess = await signer.call({
          to: spotifyCloneAddress,
          data: ethers.utils.id('users(address)').slice(0, 10) + ethers.utils.defaultAbiCoder.encode(['address'], [address]).slice(2),
        });
        setHasPremiumAccess(hasAccess);

     
        const searching = await signer.call({
          to: spotifyCloneAddress,
          data: ethers.utils.id('users(address)').slice(0, 10) + ethers.utils.defaultAbiCoder.encode(['address'], [address]).slice(2),
        });
        setIsSearching(searching);
      }
    }

    connectToBlockchain();
  }, []);

  const handleLogin = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const spotifyCloneContract = new ethers.Contract(spotifyCloneAddress, ['function setUserEthBalance(address user, uint256 balance) external'], signer);
    
    try {
      const transaction = await spotifyCloneContract.setUserEthBalance(userAddress, ethBalance);
      await transaction.wait();
      console.log('User balance set successfully');
    } catch (error) {
      console.error('Error setting user balance', error);
    }
  };

  const handleSearch = async () => {
   
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const spotifyCloneContract = new ethers.Contract(spotifyCloneAddress, ['function searchSong() external'], signer);

    try {
      const transaction = await spotifyCloneContract.searchSong();
      await transaction.wait();
      console.log('Song searched successfully');
    } catch (error) {
      console.error('Error searching song', error);
    }
  };

  return (
    <div>
      <h1>Spotify Clone</h1>
      <p>User Address: {userAddress}</p>
      <p>ETH Balance: {ethers.utils.formatEther(ethBalance)} ETH</p>
      <p>Premium Access: {hasPremiumAccess ? 'Yes' : 'No'}</p>
      <p>Searching: {isSearching ? 'Yes' : 'No'}</p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SpotifyClone;