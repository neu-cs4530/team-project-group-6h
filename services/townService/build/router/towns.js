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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = __importDefault(require('express'));
var http_status_codes_1 = require('http-status-codes');
var socket_io_1 = __importDefault(require('socket.io'));
var CoveyTownRequestHandlers_1 = require('../requestHandlers/CoveyTownRequestHandlers');
var Utils_1 = require('../Utils');
function addTownRoutes(http, app) {
  var _this = this;
  app.post('/sessions', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.townJoinHandler)({
                userName: req.body.userName,
                coveyTownID: req.body.coveyTownID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_1 = _a.sent();
            (0, Utils_1.logError)(err_1);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.delete('/towns/:townID/:townPassword', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        try {
          result = (0, CoveyTownRequestHandlers_1.townDeleteHandler)({
            coveyTownID: req.params.townID,
            coveyTownPassword: req.params.townPassword,
          });
          res.status(200).json(result);
        } catch (err) {
          (0, Utils_1.logError)(err);
          res.status(500).json({
            message: 'Internal server error, please see log in server for details',
          });
        }
        return [2];
      });
    });
  });
  app.get('/towns', express_1.default.json(), function (_req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        try {
          result = (0, CoveyTownRequestHandlers_1.townListHandler)();
          res.status(http_status_codes_1.StatusCodes.OK).json(result);
        } catch (err) {
          (0, Utils_1.logError)(err);
          res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error, please see log in server for more details',
          });
        }
        return [2];
      });
    });
  });
  app.post('/towns', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        try {
          result = (0, CoveyTownRequestHandlers_1.townCreateHandler)(req.body);
          res.status(http_status_codes_1.StatusCodes.OK).json(result);
        } catch (err) {
          (0, Utils_1.logError)(err);
          res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error, please see log in server for more details',
          });
        }
        return [2];
      });
    });
  });
  app.patch('/towns/:townID', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        try {
          result = (0, CoveyTownRequestHandlers_1.townUpdateHandler)({
            coveyTownID: req.params.townID,
            isPubliclyListed: req.body.isPubliclyListed,
            friendlyName: req.body.friendlyName,
            coveyTownPassword: req.body.coveyTownPassword,
          });
          res.status(http_status_codes_1.StatusCodes.OK).json(result);
        } catch (err) {
          (0, Utils_1.logError)(err);
          res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error, please see log in server for more details',
          });
        }
        return [2];
      });
    });
  });
  app.post('/towns/:townID/conversationAreas', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.conversationAreaCreateHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                conversationArea: req.body.conversationArea,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_2 = _a.sent();
            (0, Utils_1.logError)(err_2);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/recreationAreas', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.recreationAreaCreateHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                conversationArea: req.body.conversationArea,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_3 = _a.sent();
            (0, Utils_1.logError)(err_3);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/createLobby', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.mafiaGameLobbyCreateHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                recreationAreaLabel: req.body.recreationAreaLabel,
                hostID: req.body.hostID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_4 = _a.sent();
            (0, Utils_1.logError)(err_4);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/joinLobby', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.mafiaGameLobbyJoinHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                recreationAreaLabel: req.body.recreationAreaLabel,
                playerID: req.body.playerID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_5 = _a.sent();
            (0, Utils_1.logError)(err_5);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/destroyLobby', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_6;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.mafiaGameLobbyDestroyHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                recreationAreaLabel: req.body.recreationAreaLabel,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_6 = _a.sent();
            (0, Utils_1.logError)(err_6);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/startGame', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_7;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.mafiaGameStartHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                recreationAreaLabel: req.body.recreationAreaLabel,
                playerStartID: req.body.playerStartID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_7 = _a.sent();
            (0, Utils_1.logError)(err_7);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/nextPhase', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_8;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.mafiaGameNextPhaseHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                mafiaGameID: req.body.mafiaGameID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_8 = _a.sent();
            (0, Utils_1.logError)(err_8);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/sendVote', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_9;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.mafiaSendVoteHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                mafiaGameID: req.body.mafiaGameID,
                voterID: req.body.voterID,
                votedID: req.body.votedID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_9 = _a.sent();
            (0, Utils_1.logError)(err_9);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  app.post('/towns/:townID/setNightTarget', express_1.default.json(), function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var result, err_10;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            return [
              4,
              (0, CoveyTownRequestHandlers_1.setNightTargetHandler)({
                coveyTownID: req.params.townID,
                sessionToken: req.body.sessionToken,
                mafiaGameID: req.body.mafiaGameID,
                playerID: req.body.playerID,
                targetID: req.body.targetID,
              }),
            ];
          case 1:
            result = _a.sent();
            res.status(http_status_codes_1.StatusCodes.OK).json(result);
            return [3, 3];
          case 2:
            err_10 = _a.sent();
            (0, Utils_1.logError)(err_10);
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: 'Internal server error, please see log in server for more details',
            });
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  });
  var socketServer = new socket_io_1.default.Server(http, { cors: { origin: '*' } });
  socketServer.on('connection', CoveyTownRequestHandlers_1.townSubscriptionHandler);
  return socketServer;
}
exports.default = addTownRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG93bnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcm91dGVyL3Rvd25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTJDO0FBRTNDLHVEQUFnRDtBQUNoRCx3REFBMkI7QUFDM0Isd0ZBZ0JxRDtBQUNyRCxrQ0FBb0M7QUFFcEMsU0FBd0IsYUFBYSxDQUFDLElBQVksRUFBRSxHQUFZO0lBQWhFLGlCQXVQQztJQW5QQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBTyxDQUFDLElBQUksRUFBRSxFQUFFLFVBQU8sR0FBRyxFQUFFLEdBQUc7Ozs7OztvQkFFbEMsV0FBTSxJQUFBLDBDQUFlLEVBQUM7NEJBQ25DLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVE7NEJBQzNCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7eUJBQ2xDLENBQUMsRUFBQTs7b0JBSEksTUFBTSxHQUFHLFNBR2I7b0JBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FBQywrQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7OztvQkFFeEMsSUFBQSxnQkFBUSxFQUFDLEtBQUcsQ0FBQyxDQUFDO29CQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUMsK0JBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDakQsT0FBTyxFQUFFLGtFQUFrRTtxQkFDNUUsQ0FBQyxDQUFDOzs7OztTQUVOLENBQUMsQ0FBQztJQUtILEdBQUcsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFPLEdBQUcsRUFBRSxHQUFHOzs7WUFDeEUsSUFBSTtnQkFDSSxNQUFNLEdBQUcsSUFBQSw0Q0FBaUIsRUFBQztvQkFDL0IsV0FBVyxFQUFFLEdBQUcsQ0FB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
