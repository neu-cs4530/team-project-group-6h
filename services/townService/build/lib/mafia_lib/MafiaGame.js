'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Phase = void 0;
var nanoid_1 = require('nanoid');
var GamePlayer_1 = __importStar(require('./GamePlayer'));
var Phase;
(function (Phase) {
  Phase[(Phase['lobby'] = 0)] = 'lobby';
  Phase[(Phase['day_discussion'] = 1)] = 'day_discussion';
  Phase[(Phase['day_voting'] = 2)] = 'day_voting';
  Phase[(Phase['night'] = 3)] = 'night';
  Phase[(Phase['win'] = 4)] = 'win';
})((Phase = exports.Phase || (exports.Phase = {})));
var MafiaGame = (function () {
  function MafiaGame(host) {
    this._phase = Phase.lobby;
    this._winner = GamePlayer_1.Team.Unassigned;
    this.MIN_PLAYERS = Object.keys(GamePlayer_1.Role).length / 2 - 1;
    this._id = (0, nanoid_1.nanoid)();
    this._host = host;
    this._players = [host];
    this._gamePlayers = [];
  }
  Object.defineProperty(MafiaGame.prototype, 'changePhase', {
    set: function (phase) {
      this._phase = phase;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'phase', {
    get: function () {
      return Phase[this._phase];
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'winner', {
    get: function () {
      return this._winner;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'minPlayers', {
    get: function () {
      return this.MIN_PLAYERS;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'id', {
    get: function () {
      return this._id;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'host', {
    get: function () {
      return this._host;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'gamePlayers', {
    get: function () {
      return this._gamePlayers;
    },
    enumerable: false,
    configurable: true,
  });
  MafiaGame.prototype.playerRole = function (playerID) {
    var gamePlayer = this._gamePlayers.find(function (player) {
      return player.id === playerID;
    });
    if (gamePlayer) {
      return gamePlayer.role;
    }
    return undefined;
  };
  MafiaGame.prototype.numPlayers = function () {
    return this._players.length;
  };
  Object.defineProperty(MafiaGame.prototype, 'deadPlayers', {
    get: function () {
      return __spreadArray([], this._gamePlayers, true).filter(function (player) {
        return player.isAlive === false;
      });
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'alivePlayers', {
    get: function () {
      return __spreadArray([], this._gamePlayers, true).filter(function (player) {
        return player.isAlive === true;
      });
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'mafiaPlayers', {
    get: function () {
      return __spreadArray([], this._gamePlayers, true).filter(function (player) {
        return player.team === GamePlayer_1.Team.Mafia;
      });
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(MafiaGame.prototype, 'townPlayers', {
    get: function () {
      return __spreadArray([], this._gamePlayers, true).filter(function (player) {
        return player.team === GamePlayer_1.Team.Town;
      });
    },
    enumerable: false,
    configurable: true,
  });
  MafiaGame.prototype.addPlayer = function (player) {
    if (this._phase === Phase.lobby) {
      this._players.push(player);
      return true;
    }
    return false;
  };
  MafiaGame.prototype.getPlayerWithMostVotes = function () {
    var mostVoted;
    var mostVotes = 0;
    this._gamePlayers.forEach(function (p) {
      if (p.voteTally > mostVotes) {
        mostVoted = p;
        mostVotes = p.voteTally;
      } else if (p.voteTally === mostVotes) {
        mostVoted = undefined;
      }
    });
    return mostVoted;
  };
  MafiaGame.prototype.endDay = function () {
    if (this._phase === Phase.day_voting) {
      var votedPlayer_1 = this.getPlayerWithMostVotes();
      if (votedPlayer_1) {
        this.eliminatePlayer(votedPlayer_1.id);
        this._gamePlayers.forEach(function (player) {
          if (player === votedPlayer_1) {
            if (!player.result) {
              player.result = 'YOU were voted off! You can no longer vote or use your ability. ';
            } else {
              player.result += 'YOU were voted off! You can no longer vote or use your ability. ';
            }
          } else if (!player.result) {
            player.result = ''
              .concat(votedPlayer_1.userName, ' was VOTED OFF, with ')
              .concat(votedPlayer_1.voteTally, ' votes! ');
          } else {
            player.result += ''
              .concat(votedPlayer_1.userName, ' was VOTED OFF, with ')
              .concat(votedPlayer_1.voteTally, ' votes! ');
          }
        });
      } else {
        this._gamePlayers.forEach(function (player) {
          if (!player.result) {
            player.result = 'Nobody was voted off. ';
          } else {
            player.result += 'Nobody was voted off. ';
          }
        });
      }
    } else {
      throw new Error('Not in day phase. Currently in phase '.concat(Phase[this._phase], '.'));
    }
  };
  MafiaGame.prototype.resetFields = function () {
    this._gamePlayers.forEach(function (player) {
      player.votedPlayer = undefined;
      player.targetPlayer = undefined;
      player.result = undefined;
      player.resetTally();
    });
  };
  MafiaGame.prototype.endNight = function () {
    var _this = this;
    if (this._phase === Phase.night) {
      var godfatherIdx_1 = this._gamePlayers.findIndex(function (p) {
        return p.role === GamePlayer_1.Role.Godfather;
      });
      var doctorIdx_1 = this._gamePlayers.findIndex(function (p) {
        return p.role === GamePlayer_1.Role.Doctor;
      });
      var detectiveIdx_1 = this._gamePlayers.findIndex(function (p) {
        return p.role === GamePlayer_1.Role.Detective;
      });
      var hypnotistIdx_1 = this._gamePlayers.findIndex(function (p) {
        return p.role === GamePlayer_1.Role.Hypnotist;
      });
      var healTarget = void 0;
      if (doctorIdx_1 >= 0 && this._gamePlayers[doctorIdx_1].target) {
        healTarget = this._gamePlayers.find(function (player) {
          return player.id === _this._gamePlayers[doctorIdx_1].target;
        });
      }
      if (detectiveIdx_1 >= 0 && this._gamePlayers[detectiveIdx_1].target) {
        var target = this._gamePlayers.find(function (player) {
          return player.id === _this._gamePlayers[detectiveIdx_1].target;
        });
        if (target) {
          this._gamePlayers[detectiveIdx_1].result = ''
            .concat(target.userName, ' is a \n          ')
            .concat(GamePlayer_1.Role[target.role], ' on team ')
            .concat(GamePlayer_1.Team[target.team], '. ');
        }
      }
      if (hypnotistIdx_1 >= 0 && this._gamePlayers[hypnotistIdx_1].target) {
        var roleblocked = 'YOU were ROLEBLOCKED by a hypnotist. ';
        var target = this._gamePlayers.find(function (player) {
          return player.id === _this._gamePlayers[hypnotistIdx_1].target;
        });
        if (target) {
          switch (target.role) {
            case GamePlayer_1.Role.Detective:
              this._gamePlayers[detectiveIdx_1].result = roleblocked;
              break;
            case GamePlayer_1.Role.Doctor:
              healTarget = undefined;
              target.result = roleblocked;
              break;
            case GamePlayer_1.Role.Godfather:
              target.targetPlayer = undefined;
              target.result = roleblocked;
              break;
            default:
              break;
          }
          this._gamePlayers[hypnotistIdx_1].result = ''.concat(
            target.userName,
            ' was hypnotised. ',
          );
        }
      }
      var targetPlayer_1 = this.getPlayerWithMostVotes();
      if (godfatherIdx_1 >= 0 && this._gamePlayers[godfatherIdx_1].target) {
        targetPlayer_1 = this._gamePlayers.find(function (player) {
          return player.id === _this._gamePlayers[godfatherIdx_1].target;
        });
      }
      if (targetPlayer_1) {
        if (healTarget !== targetPlayer_1) {
          this.eliminatePlayer(targetPlayer_1.id);
          this._gamePlayers.forEach(function (player) {
            if (player === targetPlayer_1) {
              if (!player.result) {
                player.result =
                  'YOU were KILLED by the mafia! You can no longer vote or use your ability. ';
              } else {
                player.result +=
                  'YOU were KILLED by the mafia! You can no longer vote or use your ability. ';
              }
            } else if (!player.result) {
              player.result = ''.concat(
                targetPlayer_1 === null || targetPlayer_1 === void 0
                  ? void 0
                  : targetPlayer_1.userName,
                ' was KILLED by the mafia! ',
              );
            } else {
              player.result += ''.concat(
                targetPlayer_1 === null || targetPlayer_1 === void 0
                  ? void 0
                  : targetPlayer_1.userName,
                ' was KILLED by the mafia! ',
              );
            }
          });
        } else {
          this._gamePlayers.forEach(function (player) {
            if (!player.result) {
              player.result = ''.concat(
                targetPlayer_1 === null || targetPlayer_1 === void 0
                  ? void 0
                  : targetPlayer_1.userName,
                ' was TARGETTED by the mafia, but was saved! ',
              );
            } else {
              player.result += ''.concat(
                targetPlayer_1 === null || targetPlayer_1 === void 0
                  ? void 0
                  : targetPlayer_1.userName,
                ' was TARGETTED by the mafia, but was saved! ',
              );
            }
          });
        }
      } else {
        this._gamePlayers.forEach(function (player) {
          if (!player.result) {
            player.result = 'No one was targetted overnight. ';
          } else {
            player.result += 'No one was targetted overnight. ';
          }
        });
      }
    } else {
      throw new Error(
        'Not in the night phase. Currently in phase '.concat(Phase[this._phase], '.'),
      );
    }
  };
  MafiaGame.prototype.updatePhase = function () {
    if (!this.isGameOver()) {
      switch (this._phase) {
        case Phase.day_discussion:
          this._phase = Phase.day_voting;
          break;
        case Phase.day_voting:
          this._phase = Phase.night;
          break;
        case Phase.night:
          this._phase = Phase.day_discussion;
          break;
        default:
          throw Error('Game is currently in phase: '.concat(Phase[this._phase]));
      }
    } else {
      this._phase = Phase.win;
      if (this._winner === GamePlayer_1.Team.Town) {
        this._gamePlayers.forEach(function (player) {
          if (player.team === GamePlayer_1.Team.Town) {
            player.result = 'You win! All the mafia were eliminated. ';
          } else if (player.team === GamePlayer_1.Team.Mafia) {
            player.result = 'You lose! All the mafia were eliminated. ';
          }
        });
      } else if (this._winner === GamePlayer_1.Team.Mafia) {
        this._gamePlayers.forEach(function (player) {
          if (player.team === GamePlayer_1.Team.Town) {
            player.result = 'You lose! All the town were eliminated. ';
          } else if (player.team === GamePlayer_1.Team.Mafia) {
            player.result = 'You win! All the town were eliminated. ';
          }
        });
      }
    }
  };
  MafiaGame.prototype.isGameOver = function () {
    if (this.mafiaPlayers && this.townPlayers) {
      if (
        this.mafiaPlayers.every(function (player) {
          return !player.isAlive;
        }) &&
        !this.townPlayers.every(function (player) {
          return !player.isAlive;
        })
      ) {
        this._winner = GamePlayer_1.Team.Town;
        return true;
      }
      if (
        !this.mafiaPlayers.every(function (player) {
          return !player.isAlive;
        }) &&
        this.townPlayers.every(function (player) {
          return !player.isAlive;
        })
      ) {
        this._winner = GamePlayer_1.Team.Mafia;
        return true;
      }
    }
    return false;
  };
  MafiaGame.prototype.shuffle = function () {
    var _a;
    var currentIndex = this.numPlayers();
    var randomIndex = this.numPlayers();
    var playerArray = __spreadArray([], this._players, true);
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      (_a = [playerArray[randomIndex], playerArray[currentIndex]]),
        (playerArray[currentIndex] = _a[0]),
        (playerArray[randomIndex] = _a[1]);
    }
    return playerArray;
  };
  MafiaGame.prototype.partition = function (playerList) {
    var result = [];
    for (var i = this.MIN_PLAYERS; i > 0; i -= 1) {
      result.push(playerList.splice(0, Math.ceil(playerList.length / i)));
    }
    return result;
  };
  MafiaGame.prototype.eliminatePlayer = function (playerID) {
    var playerIndex = this._gamePlayers.findIndex(function (player) {
      return playerID === player.id;
    });
    if (playerIndex >= 0) {
      var gamePlayer = this._gamePlayers[playerIndex];
      if (gamePlayer.isAlive) {
        this._gamePlayers[playerIndex].eliminate();
      }
    } else {
      throw new Error('This player does not exist');
    }
  };
  MafiaGame.prototype.assignRoles = function () {
    var shuffledPlayers = this.shuffle();
    var gamePlayers = shuffledPlayers.map(function (player) {
      return new GamePlayer_1.default(player);
    });
    var _a = this.partition(gamePlayers),
      godfatherList = _a[0],
      doctorList = _a[1],
      hypnotistList = _a[2],
      detectiveList = _a[3];
    godfatherList.forEach(function (mafia) {
      mafia.team = GamePlayer_1.Team.Mafia;
      mafia.role = GamePlayer_1.Role.Unassigned;
    });
    godfatherList[0].role = GamePlayer_1.Role.Godfather;
    doctorList.forEach(function (town) {
      town.team = GamePlayer_1.Team.Town;
      town.role = GamePlayer_1.Role.Unassigned;
    });
    doctorList[0].role = GamePlayer_1.Role.Doctor;
    hypnotistList.forEach(function (town) {
      town.team = GamePlayer_1.Team.Town;
      town.role = GamePlayer_1.Role.Unassigned;
    });
    hypnotistList[0].role = GamePlayer_1.Role.Hypnotist;
    detectiveList.forEach(function (town) {
      town.team = GamePlayer_1.Team.Town;
      town.role = GamePlayer_1.Role.Unassigned;
    });
    detectiveList[0].role = GamePlayer_1.Role.Detective;
    this._gamePlayers = __spreadArray(
      __spreadArray(
        __spreadArray(__spreadArray([], godfatherList, true), doctorList, true),
        hypnotistList,
        true,
      ),
      detectiveList,
      true,
    );
  };
  MafiaGame.prototype.votePlayer = function (voterID, targetID) {
    var playerIndex = this._gamePlayers.findIndex(function (player) {
      return player.id === voterID;
    });
    if (playerIndex === -1) {
      throw new Error('Vote failed: Cannot find voter.');
    }
    this._gamePlayers[playerIndex].votedPlayer = targetID;
    var targetIndex = this._gamePlayers.findIndex(function (player) {
      return player.id === targetID;
    });
    this._gamePlayers[targetIndex].vote();
    if (targetIndex === -1) {
      throw new Error('Vote failed: Cannot find target.');
    }
  };
  MafiaGame.prototype.setTarget = function (roleID, targetID) {
    var playerIndex = this._gamePlayers.findIndex(function (player) {
      return player.id === roleID;
    });
    this._gamePlayers[playerIndex].targetPlayer = targetID;
  };
  MafiaGame.prototype.gameStart = function () {
    this._phase = Phase.day_discussion;
    if (this.numPlayers() >= this.MIN_PLAYERS) {
      this.assignRoles();
    }
  };
  MafiaGame.prototype.removePlayer = function (leaver) {
    this._players = this._players.filter(function (p) {
      return leaver.id !== p.id;
    });
    if (
      (leaver === this._host && this._phase === Phase.lobby) ||
      (this._players.length <= 2 && this._phase !== Phase.lobby)
    ) {
      this._phase = Phase.win;
      this._players = [];
    }
  };
  return MafiaGame;
})();
exports.default = MafiaGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFmaWFHYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9tYWZpYV9saWIvTWFmaWFHYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQWdDO0FBRWhDLHlEQUFzRDtBQUt0RCxJQUFZLEtBTVg7QUFORCxXQUFZLEtBQUs7SUFDZixtQ0FBTyxDQUFBO0lBQ1AscURBQWdCLENBQUE7SUFDaEIsNkNBQVksQ0FBQTtJQUNaLG1DQUFPLENBQUE7SUFDUCwrQkFBSyxDQUFBO0FBQ1AsQ0FBQyxFQU5XLEtBQUssR0FBTCxhQUFLLEtBQUwsYUFBSyxRQU1oQjtBQUtEO0lBaUJFLG1CQUFZLElBQVk7UUFSaEIsV0FBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFckIsWUFBTyxHQUFHLGlCQUFJLENBQUMsVUFBVSxDQUFDO1FBSTFCLGdCQUFXLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHN0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFBLGVBQU0sR0FBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsc0JBQUksa0NBQVc7YUFBZixVQUFnQixLQUFZO1lBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksNEJBQUs7YUFBVDtZQUNFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDZCQUFNO2FBQVY7WUFDRSxP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
