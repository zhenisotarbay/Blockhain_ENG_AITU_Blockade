import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RockPaperScissors from './contracts/RockPaperScissors.json';

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import GameContract from './contracts/Game.json';

function App() {
  const [gameContract, setGameContract] = useState(null);
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [move, setMove] = useState('');

  useEffect(() => {
    const connectToContract = async () => {
      // Подключаемся к локальному блокчейну с помощью Web3
      const web3 = new Web3('http://localhost:8545');
      // Получаем список доступных аккаунтов
      const accounts = await web3.eth.getAccounts();
      // Создаем экземпляр смарт-контракта
      const gameContract = new web3.eth.Contract(GameContract.abi, GameContract.networks['5777'].address);
      // Устанавливаем контракт в состояние
      setGameContract(gameContract);
      // Получаем список всех игр из контракта
      const gameCount = await gameContract.methods.getGameCount().call();
      const gamePromises = [];
      for (let i = 0; i < gameCount; i++) {
        gamePromises.push(gameContract.methods.games(i).call());
      }
      const gameResults = await Promise.all(gamePromises);
      setGames(gameResults);
    };

    connectToContract();
  }, []);

  // Остальной код компонента
}
