// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DicePokerGame is RrpRequesterV0,ERC20 {
    event DiceRolled(uint256[] values);
    event BetPlaced(address player, uint256 amount);
    event WinnerDeclared(address winner, uint256 amount, uint256 roundNumber);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
event startRounds(uint256 gameId,address player1, address player2);

    mapping(bytes32 => uint256) public requestIdToGameId;

    address public airnode;
    bytes32 public endpointIdUint256;
    address public sponsorWallet;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfill;

    struct Player {
        address addr;
        uint256 bet;
        uint256[] diceRolls;
        uint256 roundScore;
    }

    struct Game {
        Player player1;
        Player player2;
        bool gameOver;
        bool playr;       
         uint256[] rerollIndices;
         uint256 roundPrizePool;
         address UnabletoPay;

    }

    mapping(uint256 => Game) public games;

    constructor(address _airnodeRrp) RrpRequesterV0(_airnodeRrp)  ERC20("DPLL", "DPK"){
     _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        sponsorWallet = _sponsorWallet;
    }

    function startRound(uint256 gameId, address player1Address, address player2Address) external  {
            games[gameId].player1.roundScore = 0;
            games[gameId].player2.roundScore = 0;
    
        games[gameId].roundPrizePool = 0;
        games[gameId].rerollIndices;
        games[gameId].playr;
        games[gameId].player1 = Player({
            addr: player1Address,
            bet: 0,
            diceRolls: new uint256[](5),
            roundScore: 0
        });
        games[gameId].player2 = Player({
            addr: player2Address,
            bet: 0,
            diceRolls: new uint256[](5),
            roundScore: 0
        });
  emit startRounds(gameId, games[gameId].player1.addr, games[gameId].player2.addr);
    }

    function placeBet(uint256 gameId, uint256 amount) external{
        require(msg.sender == games[gameId].player1.addr || msg.sender == games[gameId].player2.addr, "Invalid player");
         require(!games[gameId].gameOver, "Game is already over");
       _transfer(msg.sender,address(this), amount);
        emit BetPlaced(msg.sender, amount);

        if (msg.sender == games[gameId].player1.addr) {
            games[gameId].player1.bet += amount;
        } else {
            games[gameId].player2.bet += amount;
        }
         games[gameId].roundPrizePool += amount;
    }
//0x2D62332066e2735DEbEaf71AFE343236C9Ee7a1e
//0x8A0d290b2EE35eFde47810CA8fF057e109e4190B

    function makeRequestrollDice(uint256 gameId, uint256 size) external  {
           require(msg.sender == games[gameId].player1.addr || msg.sender == games[gameId].player2.addr, "Invalid player");
         require(!games[gameId].gameOver, "Game is already over");
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillDiceRoll.selector,
            abi.encode(bytes32("1u"), bytes32("size"), size)
        );
        expectingRequestWithIdToBeFulfill[requestId] = true;
        emit RequestedUint256Array(requestId, size);
         requestIdToGameId[requestId] = gameId; 
        if(msg.sender==games[gameId].player1.addr){
            games[gameId].playr=false;
          }
          if(msg.sender==games[gameId].player2.addr){
             games[gameId].playr=true;
          }
      }

     function fulfillDiceRoll(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {  
         uint256 j=0;
        require(
            expectingRequestWithIdToBeFulfill[requestId],
            "Request ID not known"
        );
         expectingRequestWithIdToBeFulfill[requestId] = false;
       uint256 gameId = requestIdToGameId[requestId];
    uint256[] memory randomValue = abi.decode(data, (uint256[]));
    emit ReceivedUint256Array(requestId, randomValue);
  
         for (uint256 i = 0; i < randomValue.length; i++) {
        randomValue[i] = (randomValue[i] % 6) + 1;
    }

     if (randomValue.length<5){
              for (uint256 i = 0; i < games[gameId].rerollIndices.length; i++) {
                     if(games[gameId].rerollIndices[i]==1 && j<randomValue.length){
                        games[gameId].rerollIndices[i]=randomValue[j];
                         j++;
                     }
              }
              if(games[gameId].playr==false){
              for(uint i=0; i< games[gameId].rerollIndices.length;i++){
                if(games[gameId].rerollIndices[i]!=0){
                 games[gameId].player1.diceRolls[i]=games[gameId].rerollIndices[i];
                }
              }
              }
              if(games[gameId].playr==true){
                 for(uint i=0; i< games[gameId].rerollIndices.length;i++){
                if(games[gameId].rerollIndices[i]!=0){
                games[gameId].player2.diceRolls[i]=games[gameId].rerollIndices[i];
                }
              }
              }
         }

            if(randomValue.length==5){
                if (games[gameId].playr==false) {
                     if(games[gameId].player1.bet>0){
                        games[gameId].player1.diceRolls = randomValue;
                        }
                }
                if (games[gameId].playr==true) {
                       if(games[gameId].player2.bet>0){
                          games[gameId].player2.diceRolls = randomValue;
                             }
                         }
                    }

    }

    function idplayerBet(uint256 gameId) external view returns(uint256[2] memory) {
          return [games[gameId].player1.bet,games[gameId].player2.bet];
    }
function  RerollOnce (uint256 gameId,uint256[] memory rerollIndicey) external {
     require(!games[gameId].gameOver, "Game is already over");
          games[gameId].rerollIndices=rerollIndicey;
}

 function sortArray(uint256[] memory dice) internal pure returns (uint256[] memory) {
        for (uint8 i = 0; i < 5; i++) {
            for (uint8 j = 0; j < 5 - i - 1; j++) {
                if (dice[j] > dice[j + 1]) {
                    (dice[j], dice[j + 1]) = (dice[j + 1], dice[j]);
                }
            }
        }
        return dice;
    }


function rankcard(uint256[] memory dice) internal pure returns (uint256) {
    dice = sortArray(dice);

    if (dice[0] == dice[4]) {
        return 9; // FiveOfAKind
    }

    if (dice[0] == dice[3] || dice[1] == dice[4]) {
        return 8; // FourOfAKind
    }

    if ((dice[0] == dice[2] && dice[3] == dice[4]) || (dice[0] == dice[1] && dice[2] == dice[4])) {
        return 7; // FullHouse
    }

    if (dice[0] + 1 == dice[1] && dice[1] + 1 == dice[2] && dice[2] + 1 == dice[3] && dice[3] + 1 == dice[4]) {
        return 6; // SixHighStraight
    }

    if (dice[0] == 1 && dice[1] == 2 && dice[2] == 3 && dice[3] == 4 && dice[4] == 5) {
        return 5; // FiveHighStraight
    }

    if (dice[0] == dice[2] || dice[1] == dice[3] || dice[2] == dice[4]) {
        return 4; // ThreeOfAKind
    }

    if ((dice[0] == dice[1] && dice[2] == dice[3]) || (dice[1] == dice[2] && dice[3] == dice[4]) || (dice[0] == dice[1] && dice[3] == dice[4])) {
        return 3; // TwoPairs
    }

    if (dice[0] == dice[1] || dice[1] == dice[2] || dice[2] == dice[3] || dice[3] == dice[4]) {
        return 2; // Pair
    }
    return 1;
   }

    function getPlayerDiceRolls(uint256 gameId, address playerAddress) external view returns (uint256[] memory) {
    if (games[gameId].player1.addr == playerAddress) {
        return games[gameId].player1.diceRolls;
    } else if (games[gameId].player2.addr == playerAddress) {
        return games[gameId].player2.diceRolls;
    } else {
        revert("Invalid player address");
    }
         }
          function getScore(uint256 gameId) external view returns (uint256[2] memory) {
           return [games[gameId].player1.roundScore, games[gameId].player2.roundScore];
                                           }
          function getPlayers(uint256 gameId) external view returns (address[2] memory) {
          return [games[gameId].player1.addr, games[gameId].player2.addr];
                                           }
          function getPoolPrize(uint256 gameId) external view returns (uint256) {
             return games[gameId].roundPrizePool;
                                           }

    function determineWinner(uint256 gameId) external  payable {
         require(!games[gameId].gameOver, "Game is already over");
         require(msg.sender == games[gameId].player1.addr || msg.sender == games[gameId].player2.addr, "Invalid player");
        uint256 rankPlayer1 = rankcard(games[gameId].player1.diceRolls);
        uint256 rankPlayer2 = rankcard(games[gameId].player2.diceRolls);
    if (games[gameId].player1.roundScore == 2 || games[gameId].player2.roundScore == 2 || games[gameId].UnabletoPay==games[gameId].player1.addr || games[gameId].UnabletoPay==games[gameId].player2.addr) {
            declareFinalWinners(gameId);
        }
        if (rankPlayer1 > rankPlayer2) {
            games[gameId].player1.roundScore++;
        } else if (rankPlayer2 > rankPlayer1) {
            games[gameId].player2.roundScore++;
        }
    }

function getDiceRolls(uint256 gameId) external view returns (uint256[] memory) {
    uint256[] memory player1DiceRolls = games[gameId].player1.diceRolls;
    uint256[] memory player2DiceRolls = games[gameId].player2.diceRolls;
    uint256[] memory allDiceRolls = new uint256[](player1DiceRolls.length + player2DiceRolls.length);

   for (uint256 i = 0; i < player1DiceRolls.length; i++) {
        allDiceRolls[i] = player1DiceRolls[i];
  }
    for (uint256 i = 0; i < player2DiceRolls.length; i++) {
        allDiceRolls[player1DiceRolls.length + i] = player2DiceRolls[i];
    }
  return allDiceRolls;
}

  function declareFinalWinners(uint256 gameId) internal {
    address winnerAddress;
    if (games[gameId].player1.roundScore == 2) {
        winnerAddress = games[gameId].player1.addr;
            games[gameId].gameOver=true;
         _transfer(address(this), winnerAddress, games[gameId].roundPrizePool);   
          emit WinnerDeclared( winnerAddress,games[gameId].roundPrizePool , gameId);
    } else {
        winnerAddress = games[gameId].player2.addr;
        games[gameId].gameOver=true;
         _transfer(address(this), winnerAddress, games[gameId].roundPrizePool);
          emit WinnerDeclared( winnerAddress,games[gameId].roundPrizePool , gameId);
    }
}
  function RevertBet(uint256 gameId) external {
    require(msg.sender == games[gameId].player1.addr || msg.sender == games[gameId].player2.addr, "Invalid player");
    if (msg.sender == games[gameId].player1.addr) {
            games[gameId].gameOver=true;
          _transfer(address(this), games[gameId].player2.addr , games[gameId].roundPrizePool);
      
    } else if (msg.sender == games[gameId].player2.addr) {
            games[gameId].gameOver=true;
        _transfer(address(this), games[gameId].player1.addr ,  games[gameId].roundPrizePool);
              }
    }

}
