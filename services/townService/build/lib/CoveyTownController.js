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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var nanoid_1 = require('nanoid');
var PlayerSession_1 = __importDefault(require('../types/PlayerSession'));
var MafiaGame_1 = __importStar(require('./mafia_lib/MafiaGame'));
var TwilioVideo_1 = __importDefault(require('./TwilioVideo'));
var friendlyNanoID = (0, nanoid_1.customAlphabet)('1234567890ABCDEF', 8);
var CoveyTownController = (function () {
  function CoveyTownController(friendlyName, isPubliclyListed) {
    this._players = [];
    this._sessions = [];
    this._videoClient = TwilioVideo_1.default.getInstance();
    this._listeners = [];
    this._conversationAreas = [];
    this._recreationAreas = [];
    this._mafiaGames = [];
    this._coveyTownID = process.env.DEMO_TOWN_ID === friendlyName ? friendlyName : friendlyNanoID();
    this._capacity = 50;
    this._townUpdatePassword = (0, nanoid_1.nanoid)(24);
    this._isPubliclyListed = isPubliclyListed;
    this._friendlyName = friendlyName;
  }
  Object.defineProperty(CoveyTownController.prototype, 'capacity', {
    get: function () {
      return this._capacity;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'isPubliclyListed', {
    get: function () {
      return this._isPubliclyListed;
    },
    set: function (value) {
      this._isPubliclyListed = value;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'townUpdatePassword', {
    get: function () {
      return this._townUpdatePassword;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'players', {
    get: function () {
      return this._players;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'occupancy', {
    get: function () {
      return this._listeners.length;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'friendlyName', {
    get: function () {
      return this._friendlyName;
    },
    set: function (value) {
      this._friendlyName = value;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'coveyTownID', {
    get: function () {
      return this._coveyTownID;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'conversationAreas', {
    get: function () {
      return this._conversationAreas;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'recreationAreas', {
    get: function () {
      return this._recreationAreas;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(CoveyTownController.prototype, 'mafiaGames', {
    get: function () {
      return this._mafiaGames;
    },
    enumerable: false,
    configurable: true,
  });
  CoveyTownController.prototype.addPlayer = function (newPlayer) {
    return __awaiter(this, void 0, void 0, function () {
      var theSession, _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            theSession = new PlayerSession_1.default(newPlayer);
            this._sessions.push(theSession);
            this._players.push(newPlayer);
            _a = theSession;
            return [4, this._videoClient.getTokenForTown(this._coveyTownID, newPlayer.id)];
          case 1:
            _a.videoToken = _b.sent();
            this._listeners.forEach(function (listener) {
              return listener.onPlayerJoined(newPlayer);
            });
            return [2, theSession];
        }
      });
    });
  };
  CoveyTownController.prototype.destroySession = function (session) {
    this._players = this._players.filter(function (p) {
      return p.id !== session.player.id;
    });
    this._sessions = this._sessions.filter(function (s) {
      return s.sessionToken !== session.sessionToken;
    });
    this._listeners.forEach(function (listener) {
      return listener.onPlayerDisconnected(session.player);
    });
    var conversation = session.player.activeConversationArea;
    if (conversation) {
      this.removePlayerFromConversationArea(session.player, conversation);
    }
  };
  CoveyTownController.prototype.updatePlayerLocation = function (player, location) {
    var conversation = this.conversationAreas.find(function (conv) {
      return conv.label === location.conversationLabel;
    });
    var prevConversation = player.activeConversationArea;
    player.location = location;
    player.activeConversationArea = conversation;
    if (conversation !== prevConversation) {
      if (prevConversation) {
        this.removePlayerFromConversationArea(player, prevConversation);
      }
      if (conversation) {
        conversation.occupantsByID.push(player.id);
        var recreation_1 = this.recreationAreas.find(function (rec) {
          return rec.label === location.conversationLabel;
        });
        if (recreation_1) {
          this._listeners.forEach(function (listener) {
            return listener.onRecreationAreaUpdated(recreation_1);
          });
        } else {
          this._listeners.forEach(function (listener) {
            return listener.onConversationAreaUpdated(conversation);
          });
        }
      }
    }
    this._listeners.forEach(function (listener) {
      return listener.onPlayerMoved(player);
    });
  };
  CoveyTownController.prototype.removePlayerFromConversationArea = function (player, conversation) {
    var recArea = this._recreationAreas.find(function (rec) {
      return rec.label === conversation.label;
    });
    conversation.occupantsByID.splice(
      conversation.occupantsByID.findIndex(function (p) {
        return p === player.id;
      }),
      1,
    );
    if (conversation.occupantsByID.length === 0) {
      this._conversationAreas.splice(
        this._conversationAreas.findIndex(function (conv) {
          return conv === conversation;
        }),
        1,
      );
      if (recArea) {
        this._recreationAreas.splice(
          this._recreationAreas.findIndex(function (rec) {
            return rec === conversation;
          }),
          1,
        );
        this._listeners.forEach(function (listener) {
          return listener.onRecreationAreaDestroyed(recArea);
        });
        this._mafiaGames.splice(
          this.mafiaGames.findIndex(function (p) {
            return p.id === recArea._mafiaGameID;
          }),
        );
      } else {
        this._listeners.forEach(function (listener) {
          return listener.onConversationAreaDestroyed(conversation);
        });
      }
    } else if (recArea) {
      this._listeners.forEach(function (listener) {
        return listener.onRecreationAreaUpdated(recArea);
      });
    } else {
      this._listeners.forEach(function (listener) {
        return listener.onConversationAreaUpdated(conversation);
      });
    }
  };
  CoveyTownController.prototype.isValidArea = function (_conversationArea) {
    if (
      this._conversationAreas.find(function (eachExistingConversation) {
        return eachExistingConversation.label === _conversationArea.label;
      })
    )
      return false;
    if (_conversationArea.topic === '') {
      return false;
    }
    if (
      this._conversationAreas.find(function (eachExistingConversation) {
        return CoveyTownController.boxesOverlap(
          eachExistingConversation.boundingBox,
          _conversationArea.boundingBox,
        );
      }) !== undefined
    ) {
      return false;
    }
    return true;
  };
  CoveyTownController.prototype.addConversationArea = function (_conversationArea) {
    if (!this.isValidArea(_conversationArea)) {
      return false;
    }
    var newArea = Object.assign(_conversationArea);
    this._conversationAreas.push(newArea);
    var playersInThisConversation = this.players.filter(function (player) {
      return player.isWithin(newArea);
    });
    playersInThisConversation.forEach(function (player) {
      player.activeConversationArea = newArea;
    });
    newArea.occupantsByID = playersInThisConversation.map(function (player) {
      return player.id;
    });
    this._listeners.forEach(function (listener) {
      return listener.onConversationAreaUpdated(newArea);
    });
    return true;
  };
  CoveyTownController.prototype.addRecreationArea = function (_recreationArea) {
    if (!this.isValidArea(_recreationArea)) {
      return false;
    }
    var newArea = Object.assign(_recreationArea);
    this._conversationAreas.push(newArea);
    this._recreationAreas.push(newArea);
    var playersInThisConversation = this.players.filter(function (player) {
      return player.isWithin(newArea);
    });
    playersInThisConversation.forEach(function (player) {
      player.activeConversationArea = newArea;
    });
    newArea.occupantsByID = playersInThisConversation.map(function (player) {
      return player.id;
    });
    this._listeners.forEach(function (listener) {
      return listener.onRecreationAreaUpdated(newArea);
    });
    return true;
  };
  CoveyTownController.prototype.createMafiaGameLobby = function (recAreaLabel, hostID) {
    var areaToAddGame = this.recreationAreas.find(function (area) {
      return area.label === recAreaLabel;
    });
    if (areaToAddGame) {
      if (areaToAddGame._mafiaGameID) {
        return false;
      }
    } else {
      return false;
    }
    var host = areaToAddGame.occupantsByID.find(function (id) {
      return id === hostID;
    });
    var hostPlayer = this._players.find(function (player) {
      return player.id === hostID;
    });
    if (!host || !hostPlayer) {
      return false;
    }
    var newGame = new MafiaGame_1.default(hostPlayer);
    areaToAddGame._mafiaGameID = newGame.id;
    this._mafiaGames.push(newGame);
    this._listeners.forEach(function (listener) {
      return listener.onLobbyCreated(areaToAddGame, hostID, newGame.id);
    });
    return true;
  };
  CoveyTownController.prototype.joinMafiaGameLobby = function (recAreaLabel, playerID) {
    var recArea = this._recreationAreas.find(function (rec) {
      return rec.label === recAreaLabel;
    });
    if (!recArea) {
      return false;
    }
    var mafiaGame = this._mafiaGames.find(function (g) {
      return g.id === recArea._mafiaGameID;
    });
    if ((mafiaGame === null || mafiaGame === void 0 ? void 0 : mafiaGame.phase) !== 'lobby') {
      return false;
    }
    var player = this._players.find(function (p) {
      return p.id === playerID;
    });
    if (!player) {
      return false;
    }
    if (!recArea.occupantsByID.includes(playerID)) {
      return false;
    }
    if (mafiaGame.addPlayer(player)) {
      this._listeners.forEach(function (listener) {
        return listener.onPlayerJoinedGame(recAreaLabel, playerID);
      });
      return true;
    }
    return false;
  };
  CoveyTownController.prototype.destroyMafiaGameLobby = function (recAreaLabel) {
    var recArea = this._recreationAreas.find(function (rec) {
      return rec.label === recAreaLabel;
    });
    if (recArea) {
      var mafiaGame = this._mafiaGames.find(function (g) {
        return g.id === recArea._mafiaGameID;
      });
      if (mafiaGame) {
        recArea._mafiaGameID = undefined;
        this._listeners.forEach(function (listener) {
          return listener.onLobbyDestroyed(recAreaLabel);
        });
        return true;
      }
    }
    return false;
  };
  CoveyTownController.prototype.startMafiaGame = function (recAreaLabel, playerStartID) {
    var recArea = this._recreationAreas.find(function (rec) {
      return rec.label === recAreaLabel;
    });
    var gameID = recArea === null || recArea === void 0 ? void 0 : recArea._mafiaGameID;
    var mafiaGame = this._mafiaGames.find(function (game) {
      return game.id === gameID;
    });
    if (!gameID || !mafiaGame || mafiaGame.phase !== 'lobby') {
      return false;
    }
    var player = this.players.find(function (p) {
      return p.id === playerStartID;
    });
    if (
      !player ||
      !player.activeConversationArea ||
      player.activeConversationArea.label !== recAreaLabel ||
      player !== mafiaGame.host
    ) {
      return false;
    }
    mafiaGame.gameStart();
    var serverGamePlayers = [];
    mafiaGame.gamePlayers.forEach(function (gp) {
      serverGamePlayers.push(gp.toServerGamePlayer());
    });
    this._listeners.forEach(function (listener) {
      return listener.onMafiaGameStarted(recAreaLabel, serverGamePlayers);
    });
    return true;
  };
  CoveyTownController.prototype.nextGamePhase = function (mafiaGameID) {
    var mafiaGame = this._mafiaGames.find(function (game) {
      return game.id === mafiaGameID;
    });
    if (!mafiaGame || mafiaGame.phase === 'lobby') {
      return false;
    }
    try {
      if (mafiaGame.phase === MafiaGame_1.Phase[MafiaGame_1.Phase.day_voting]) {
        mafiaGame.endDay();
      }
      if (mafiaGame.phase === MafiaGame_1.Phase[MafiaGame_1.Phase.night]) {
        mafiaGame.endNight();
      }
      mafiaGame.updatePhase();
      this._listeners.forEach(function (listener) {
        return listener.onMafiaGameUpdated(
          mafiaGameID,
          mafiaGame.phase,
          mafiaGame.gamePlayers.map(function (p) {
            return p.toServerGamePlayer();
          }),
        );
      });
      mafiaGame.resetFields();
    } catch (err) {
      return false;
    }
    var alivePlayers = mafiaGame.gamePlayers.filter(function (p) {
      return p.isAlive;
    });
    var deadPlayers = mafiaGame.gamePlayers.filter(function (p) {
      return !p.isAlive;
    });
    return true;
  };
  CoveyTownController.prototype.sendVote = function (mafiaGameID, voterID, votedID) {
    var mafiaGame = this._mafiaGames.find(function (game) {
      return game.id === mafiaGameID;
    });
    if (!mafiaGame) {
      return false;
    }
    var alivePlayers = mafiaGame.alivePlayers.map(function (p) {
      return p.id;
    });
    if (!alivePlayers.includes(voterID) || !alivePlayers.includes(votedID)) {
      return false;
    }
    mafiaGame.votePlayer(voterID, votedID);
    return true;
  };
  CoveyTownController.prototype.setNightTarget = function (mafiaGameID, playerID, targetID) {
    var mafiaGame = this._mafiaGames.find(function (g) {
      return g.id === mafiaGameID;
    });
    if (!mafiaGame || mafiaGame.phase !== MafiaGame_1.Phase[MafiaGame_1.Phase.night]) {
      return false;
    }
    var player = mafiaGame.alivePlayers.find(function (p) {
      return p.id === playerID;
    });
    var target = mafiaGame.alivePlayers.find(function (p) {
      return p.id === targetID;
    });
    if (!player || !target) {
      return false;
    }
    player.targetPlayer = targetID;
    return true;
  };
  CoveyTownController.boxesOverlap = function (box1, box2) {
    var toRectPoints = function (box) {
      return {
        x1: box.x - box.width / 2,
        x2: box.x + box.width / 2,
        y1: box.y - box.height / 2,
        y2: box.y + box.height / 2,
      };
    };
    var rect1 = toRectPoints(box1);
    var rect2 = toRectPoints(box2);
    var noOverlap =
      rect1.x1 >= rect2.x2 || rect2.x1 >= rect1.x2 || rect1.y1 >= rect2.y2 || rect2.y1 >= rect1.y2;
    return !noOverlap;
  };
  CoveyTownController.prototype.addTownListener = function (listener) {
    this._listeners.push(listener);
  };
  CoveyTownController.prototype.removeTownListener = function (listener) {
    this._listeners = this._listeners.filter(function (v) {
      return v !== listener;
    });
  };
  CoveyTownController.prototype.onChatMessage = function (message) {
    this._listeners.forEach(function (listener) {
      return listener.onChatMessage(message);
    });
  };
  CoveyTownController.prototype.getSessionByToken = function (token) {
    return this._sessions.find(function (p) {
      return p.sessionToken === token;
    });
  };
  CoveyTownController.prototype.disconnectAllPlayers = function () {
    this._listeners.forEach(function (listener) {
      return listener.onTownDestroyed();
    });
  };
  return CoveyTownController;
})();
exports.default = CoveyTownController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ292ZXlUb3duQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQ292ZXlUb3duQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQWdEO0FBVWhELHlFQUFtRDtBQUduRCxpRUFBeUQ7QUFDekQsOERBQXdDO0FBRXhDLElBQU0sY0FBYyxHQUFHLElBQUEsdUJBQWMsRUFBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztBQU03RDtJQWtGRSw2QkFBWSxZQUFvQixFQUFFLGdCQUF5QjtRQWhDbkQsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUd4QixjQUFTLEdBQW9CLEVBQUUsQ0FBQztRQUdoQyxpQkFBWSxHQUFpQixxQkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBR3ZELGVBQVUsR0FBd0IsRUFBRSxDQUFDO1FBR3JDLHVCQUFrQixHQUFpQixFQUFFLENBQUM7UUFJdEMscUJBQWdCLEdBQTJCLEVBQUUsQ0FBQztRQUk5QyxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFhcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDaEcsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUEsZUFBTSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztJQUNwQyxDQUFDO0lBdkZELHNCQUFJLHlDQUFRO2FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFT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
