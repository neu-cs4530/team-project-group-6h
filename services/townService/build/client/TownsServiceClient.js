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
var assert_1 = __importDefault(require('assert'));
var axios_1 = __importDefault(require('axios'));
var TownsServiceClient = (function () {
  function TownsServiceClient(serviceURL) {
    var baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    (0, assert_1.default)(baseURL);
    this._axios = axios_1.default.create({ baseURL: baseURL });
  }
  TownsServiceClient.unwrapOrThrowError = function (response, ignoreResponse) {
    if (ignoreResponse === void 0) {
      ignoreResponse = false;
    }
    if (response.data.isOK) {
      if (ignoreResponse) {
        return {};
      }
      (0, assert_1.default)(response.data.response);
      return response.data.response;
    }
    throw new Error('Error processing request: '.concat(response.data.message));
  };
  TownsServiceClient.prototype.createTown = function (requestData) {
    return __awaiter(this, void 0, void 0, function () {
      var responseWrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4, this._axios.post('/towns', requestData)];
          case 1:
            responseWrapper = _a.sent();
            return [2, TownsServiceClient.unwrapOrThrowError(responseWrapper)];
        }
      });
    });
  };
  TownsServiceClient.prototype.updateTown = function (requestData) {
    return __awaiter(this, void 0, void 0, function () {
      var responseWrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4, this._axios.patch('/towns/'.concat(requestData.coveyTownID), requestData)];
          case 1:
            responseWrapper = _a.sent();
            return [2, TownsServiceClient.unwrapOrThrowError(responseWrapper, true)];
        }
      });
    });
  };
  TownsServiceClient.prototype.deleteTown = function (requestData) {
    return __awaiter(this, void 0, void 0, function () {
      var responseWrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4,
              this._axios.delete(
                '/towns/'
                  .concat(requestData.coveyTownID, '/')
                  .concat(requestData.coveyTownPassword),
              ),
            ];
          case 1:
            responseWrapper = _a.sent();
            return [2, TownsServiceClient.unwrapOrThrowError(responseWrapper, true)];
        }
      });
    });
  };
  TownsServiceClient.prototype.listTowns = function () {
    return __awaiter(this, void 0, void 0, function () {
      var responseWrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4, this._axios.get('/towns')];
          case 1:
            responseWrapper = _a.sent();
            return [2, TownsServiceClient.unwrapOrThrowError(responseWrapper)];
        }
      });
    });
  };
  TownsServiceClient.prototype.joinTown = function (requestData) {
    return __awaiter(this, void 0, void 0, function () {
      var responseWrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4, this._axios.post('/sessions', requestData)];
          case 1:
            responseWrapper = _a.sent();
            return [2, TownsServiceClient.unwrapOrThrowError(responseWrapper)];
        }
      });
    });
  };
  TownsServiceClient.prototype.createConversationArea = function (requestData) {
    return __awaiter(this, void 0, void 0, function () {
      var responseWrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4,
              this._axios.post(
                '/towns/'.concat(requestData.coveyTownID, '/conversationAreas'),
                requestData,
              ),
            ];
          case 1:
            responseWrapper = _a.sent();
            return [2, TownsServiceClient.unwrapOrThrowError(responseWrapper)];
        }
      });
    });
  };
  return TownsServiceClient;
})();
exports.default = TownsServiceClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG93bnNTZXJ2aWNlQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC9Ub3duc1NlcnZpY2VDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBNEI7QUFDNUIsZ0RBQTREO0FBbU01RDtJQVFFLDRCQUFZLFVBQW1CO1FBQzdCLElBQU0sT0FBTyxHQUFHLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDO1FBQ3RFLElBQUEsZ0JBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLHFDQUFrQixHQUF6QixVQUNFLFFBQTRDLEVBQzVDLGNBQXNCO1FBQXRCLCtCQUFBLEVBQUEsc0JBQXNCO1FBRXRCLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDdEIsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBTyxDQUFDO2FBQ2hCO1lBQ0QsSUFBQSxnQkFBTSxFQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUMvQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQTZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFFLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUssdUNBQVUsR0FBaEIsVUFBaUIsV0FBOEI7Ozs7OzRCQUNyQixXQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUM1QyxRQUFRLEVBQ1IsV0FBVyxDQUNaLEVBQUE7O3dCQUhLLGVBQWUsR0FBRyxTQUd2Qjt3QkFDRCxXQUFPLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxFQUFDOzs7O0tBQy9EO0lBRUssdUNBQVUsR0FBaEIsVUFBaUIsV0FBOEI7Ozs7OzRCQUNyQixXQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUM3QyxpQkFBVSxXQUFXLENBQUMsV0FBVyxDQUFFLEVBQ25DLFdBQVcsQ0FDWixFQUFBOzt3QkFISyxlQUFlLEdBQUcsU0FHdkI7d0JBQ0QsV0FBTyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEVBQUM7Ozs7S0FDckU7SUFFSyx1Q0FBVSxHQUFoQixVQUFpQixXQUE4Qjs7Ozs7NEJBQ3JCLFdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQzlDLGlCQUFVLFdBQVcsQ0FBQyxXQUFXLGNBQUksV0FBVyxDQUFDLGlCQUFpQixDQUFFLENBQ3JFLEVBQUE7O3dCQUZLLGVBQWUsR0FBRyxTQUV2Qjt3QkFDRCxXQUFPLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsRUFBQzs7OztLQUNyRTtJQUVLLHNDQUFTLEdBQWY7Ozs7OzRCQUMwQixXQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFxQyxRQUFRLENBQUMsRUFBQTs7d0JBQXJGLGVBQWUsR0FBRyxTQUFtRTt3QkFDM0YsV0FBTyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsRUFBQzs7OztLQUMvRDtJQUVLLHFDQUFRLEdBQWQsVUFBZSxXQUE0Qjs7Ozs7NEJBQ2pCLFdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFBOzt3QkFBbEUsZUFBZSxHQUFHLFNBQWdEO3dCQUN4RSxXQUFPLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxFQUFDOzs7O0tBQy9EO0lBRUssbURBQXNCLEdBQTVCLFVBQTZCLFdBQTBDOzs7Ozs0QkFDN0MsV0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDNUMsaUJBQVUsV0FBVyxDQUFDLFdBQVcsdUJBQW9CLEVBQ3JELFdBQVcsQ0FDWixFQUFBOzt3QkFISyxlQUFlLEdBQUcsU0FHdkI7d0JBQ0QsV0FBTyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsRUFBQzs7OztLQUMvRDtJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXBFRCxJQW9FQyJ9
