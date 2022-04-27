require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/v5i6qtE4a6MP6__MslnHfK-nt5qn57q8',
      accounts: ['17fbec812c14e2ea7a49377df50a785dfdf8d48518329e5f3d2db6409feb0ae7'],
    },
  },
};
