'use strict';
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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.townSubscriptionHandler = exports.setNightTargetHandler = exports.mafiaSendVoteHandler = exports.mafiaGameNextPhaseHandler = exports.mafiaGameStartHandler = exports.mafiaGameLobbyDestroyHandler = exports.mafiaGameLobbyJoinHandler = exports.mafiaGameLobbyCreateHandler = exports.recreationAreaCreateHandler = exports.conversationAreaCreateHandler = exports.townUpdateHandler = exports.townDeleteHandler = exports.townCreateHandler = exports.townListHandler = exports.townJoinHandler = void 0;
var assert_1 = __importDefault(require('assert'));
var CoveyTownsStore_1 = __importDefault(require('../lib/CoveyTownsStore'));
var Player_1 = __importDefault(require('../types/Player'));
function townJoinHandler(requestData) {
  return __awaiter(this, void 0, void 0, function () {
    var townsStore, coveyTownController, newPlayer, newSession;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          townsStore = CoveyTownsStore_1.default.getInstance();
          coveyTownController = townsStore.getControllerForTown(requestData.coveyTownID);
          if (!coveyTownController) {
            return [
              2,
              {
                isOK: false,
                message: 'Error: No such town',
              },
            ];
          }
          newPlayer = new Player_1.default(requestData.userName);
          return [4, coveyTownController.addPlayer(newPlayer)];
        case 1:
          newSession = _a.sent();
          (0, assert_1.default)(newSession.videoToken);
          return [
            2,
            {
              isOK: true,
              response: {
                coveyUserID: newPlayer.id,
                coveySessionToken: newSession.sessionToken,
                providerVideoToken: newSession.videoToken,
                currentPlayers: coveyTownController.players,
                friendlyName: coveyTownController.friendlyName,
                isPubliclyListed: coveyTownController.isPubliclyListed,
                conversationAreas: coveyTownController.conversationAreas,
                recreationAreas: coveyTownController.recreationAreas,
              },
            },
          ];
      }
    });
  });
}
exports.townJoinHandler = townJoinHandler;
function townListHandler() {
  var townsStore = CoveyTownsStore_1.default.getInstance();
  return {
    isOK: true,
    response: { towns: townsStore.getTowns() },
  };
}
exports.townListHandler = townListHandler;
function townCreateHandler(requestData) {
  var townsStore = CoveyTownsStore_1.default.getInstance();
  if (requestData.friendlyName.length === 0) {
    return {
      isOK: false,
      message: 'FriendlyName must be specified',
    };
  }
  var newTown = townsStore.createTown(requestData.friendlyName, requestData.isPubliclyListed);
  return {
    isOK: true,
    response: {
      coveyTownID: newTown.coveyTownID,
      coveyTownPassword: newTown.townUpdatePassword,
    },
  };
}
exports.townCreateHandler = townCreateHandler;
function townDeleteHandler(requestData) {
  var townsStore = CoveyTownsStore_1.default.getInstance();
  var success = townsStore.deleteTown(requestData.coveyTownID, requestData.coveyTownPassword);
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Invalid password. Please double check your town update password.'
      : undefined,
  };
}
exports.townDeleteHandler = townDeleteHandler;
function townUpdateHandler(requestData) {
  var townsStore = CoveyTownsStore_1.default.getInstance();
  var success = townsStore.updateTown(
    requestData.coveyTownID,
    requestData.coveyTownPassword,
    requestData.friendlyName,
    requestData.isPubliclyListed,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Invalid password or update values specified. Please double check your town update password.'
      : undefined,
  };
}
exports.townUpdateHandler = townUpdateHandler;
function getTownController(coveyTownID) {
  var townsStore = CoveyTownsStore_1.default.getInstance();
  var townController = townsStore.getControllerForTown(coveyTownID);
  return townController;
}
function conversationAreaCreateHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to create conversation area '
        .concat(_requestData.conversationArea.label, ' with topic ')
        .concat(_requestData.conversationArea.topic),
    };
  }
  var success = townController.addConversationArea(_requestData.conversationArea);
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to create conversation area '
          .concat(_requestData.conversationArea.label, ' with topic ')
          .concat(_requestData.conversationArea.topic)
      : undefined,
  };
}
exports.conversationAreaCreateHandler = conversationAreaCreateHandler;
function recreationAreaCreateHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to create recreation area '
        .concat(_requestData.conversationArea.label, ' with topic ')
        .concat(_requestData.conversationArea.topic),
    };
  }
  var success = townController.addRecreationArea(_requestData.conversationArea);
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to create recreation area '
          .concat(_requestData.conversationArea.label, ' with topic ')
          .concat(_requestData.conversationArea.topic)
      : undefined,
  };
}
exports.recreationAreaCreateHandler = recreationAreaCreateHandler;
function mafiaGameLobbyCreateHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to create mafia game lobby in '.concat(
        _requestData.recreationAreaLabel,
        '.',
      ),
    };
  }
  var success = townController.createMafiaGameLobby(
    _requestData.recreationAreaLabel,
    _requestData.hostID,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to create mafia game lobby in '.concat(_requestData.recreationAreaLabel, '.')
      : undefined,
  };
}
exports.mafiaGameLobbyCreateHandler = mafiaGameLobbyCreateHandler;
function mafiaGameLobbyJoinHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    console.log('Invalid session/token');
    return {
      isOK: false,
      response: {},
      message: 'Unable to join mafia game lobby in '.concat(_requestData.recreationAreaLabel, '.'),
    };
  }
  var success = townController.joinMafiaGameLobby(
    _requestData.recreationAreaLabel,
    _requestData.playerID,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to join mafia game lobby in '.concat(_requestData.recreationAreaLabel, '.')
      : undefined,
  };
}
exports.mafiaGameLobbyJoinHandler = mafiaGameLobbyJoinHandler;
function mafiaGameLobbyDestroyHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to join destroy game lobby in '.concat(
        _requestData.recreationAreaLabel,
        '.',
      ),
    };
  }
  var success = townController.destroyMafiaGameLobby(_requestData.recreationAreaLabel);
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to destroy mafia game lobby in '.concat(_requestData.recreationAreaLabel, '.')
      : undefined,
  };
}
exports.mafiaGameLobbyDestroyHandler = mafiaGameLobbyDestroyHandler;
function mafiaGameStartHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to start mafia game in '.concat(_requestData.recreationAreaLabel, '.'),
    };
  }
  var success = townController.startMafiaGame(
    _requestData.recreationAreaLabel,
    _requestData.playerStartID,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to start mafia game in '.concat(_requestData.recreationAreaLabel, '.')
      : undefined,
  };
}
exports.mafiaGameStartHandler = mafiaGameStartHandler;
function mafiaGameNextPhaseHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to update phase in Mafia Game:'.concat(_requestData.mafiaGameID, '.'),
    };
  }
  var success = townController.nextGamePhase(_requestData.mafiaGameID);
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to update phase in Mafia Game:'.concat(_requestData.mafiaGameID, '.')
      : undefined,
  };
}
exports.mafiaGameNextPhaseHandler = mafiaGameNextPhaseHandler;
function mafiaSendVoteHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to send vote in Mafia Game:'.concat(_requestData.mafiaGameID, '.'),
    };
  }
  var success = townController.sendVote(
    _requestData.mafiaGameID,
    _requestData.voterID,
    _requestData.votedID,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to send vote in mafia game:'.concat(_requestData.mafiaGameID, '.')
      : undefined,
  };
}
exports.mafiaSendVoteHandler = mafiaSendVoteHandler;
function setNightTargetHandler(_requestData) {
  var townController = getTownController(_requestData.coveyTownID);
  if (
    !(townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(_requestData.sessionToken))
  ) {
    return {
      isOK: false,
      response: {},
      message: 'Unable to set '
        .concat(_requestData.playerID, "'s target to ")
        .concat(_requestData.targetID, '.'),
    };
  }
  var success = townController.setNightTarget(
    _requestData.mafiaGameID,
    _requestData.playerID,
    _requestData.targetID,
  );
  return {
    isOK: success,
    response: {},
    message: !success
      ? 'Unable to set '
          .concat(_requestData.playerID, "'s target to ")
          .concat(_requestData.targetID, '.')
      : undefined,
  };
}
exports.setNightTargetHandler = setNightTargetHandler;
function townSocketAdapter(socket) {
  return {
    onPlayerMoved: function (movedPlayer) {
      socket.emit('playerMoved', movedPlayer);
    },
    onPlayerDisconnected: function (removedPlayer) {
      socket.emit('playerDisconnect', removedPlayer);
    },
    onPlayerJoined: function (newPlayer) {
      socket.emit('newPlayer', newPlayer);
    },
    onTownDestroyed: function () {
      socket.emit('townClosing');
      socket.disconnect(true);
    },
    onConversationAreaDestroyed: function (conversation) {
      socket.emit('conversationDestroyed', conversation);
    },
    onRecreationAreaDestroyed: function (recreation) {
      socket.emit('recreationDestroyed', recreation);
    },
    onConversationAreaUpdated: function (conversation) {
      socket.emit('conversationUpdated', conversation);
    },
    onRecreationAreaUpdated: function (recreation) {
      socket.emit('recreationUpdated', recreation);
    },
    onLobbyCreated: function (recreationArea, hostID, mafiaGameID) {
      socket.emit('lobbyCreated', recreationArea, hostID, mafiaGameID);
    },
    onPlayerJoinedGame: function (recreationAreaLabel, playerID) {
      socket.emit('playerJoinedGame', recreationAreaLabel, playerID);
    },
    onLobbyDestroyed: function (recreationAreaLabel) {
      socket.emit('lobbyDestroyed', recreationAreaLabel);
    },
    onMafiaGameStarted: function (recAreaLabel, playerRoles) {
      socket.emit('mafiaGameStarted', recAreaLabel, __spreadArray([], playerRoles, true));
    },
    onMafiaGameUpdated: function (mafiaGameID, phase, gamePlayers) {
      socket.emit('mafiaGameUpdated', mafiaGameID, phase, gamePlayers);
    },
    onChatMessage: function (message) {
      socket.emit('chatMessage', message);
    },
  };
}
function townSubscriptionHandler(socket) {
  var _a = socket.handshake.auth,
    token = _a.token,
    coveyTownID = _a.coveyTownID;
  var townController = CoveyTownsStore_1.default.getInstance().getControllerForTown(coveyTownID);
  var s =
    townController === null || townController === void 0
      ? void 0
      : townController.getSessionByToken(token);
  if (!s || !townController) {
    socket.disconnect(true);
    return;
  }
  var listener = townSocketAdapter(socket);
  townController.addTownListener(listener);
  socket.on('disconnect', function () {
    townController.removeTownListener(listener);
    townController.destroySession(s);
  });
  socket.on('chatMessage', function (message) {
    townController.onChatMessage(message);
  });
  socket.on('playerMovement', function (movementData) {
    townController.updatePlayerLocation(s.player, movementData);
  });
}
exports.townSubscriptionHandler = townSubscriptionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ292ZXlUb3duUmVxdWVzdEhhbmRsZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcXVlc3RIYW5kbGVycy9Db3ZleVRvd25SZXF1ZXN0SGFuZGxlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTRCO0FBZ0I1QiwyRUFBcUQ7QUFHckQsMkRBQXFDO0FBaUdyQyxTQUFzQixlQUFlLENBQ25DLFdBQTRCOzs7Ozs7b0JBRXRCLFVBQVUsR0FBRyx5QkFBZSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUUzQyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNyRixJQUFJLENBQUMsbUJBQW1CLEVBQUU7d0JBQ3hCLFdBQU87Z0NBQ0wsSUFBSSxFQUFFLEtBQUs7Z0NBQ1gsT0FBTyxFQUFFLHFCQUFxQjs2QkFDL0IsRUFBQztxQkFDSDtvQkFDSyxTQUFTLEdBQUcsSUFBSSxnQkFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEMsV0FBTSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUE7O29CQUEzRCxVQUFVLEdBQUcsU0FBOEM7b0JBQ2pFLElBQUEsZ0JBQU0sRUFBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzlCLFdBQU87NEJBQ0wsSUFBSSxFQUFFLElBQUk7NEJBQ1YsUUFBUSxFQUFFO2dDQUNSLFdBQVcsRUFBRSxTQUFTLENBQUMsRUFBRTtnQ0FDekIsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLFlBQVk7Z0NBQzFDLGtCQUFrQixFQUFFLFVBQVUsQ0FBQyxVQUFVO2dDQUN6QyxjQUFjLEVBQUUsbUJBQW1CLENBQUMsT0FBTztnQ0FDM0MsWUFBWSxFQUFFLG1CQUFtQixDQUFDLFlBQVk7Z0NBQzlDLGdCQUFn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
