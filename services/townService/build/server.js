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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = __importDefault(require('express'));
var http = __importStar(require('http'));
var cors_1 = __importDefault(require('cors'));
var towns_1 = __importDefault(require('./router/towns'));
var CoveyTownsStore_1 = __importDefault(require('./lib/CoveyTownsStore'));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var server = http.createServer(app);
(0, towns_1.default)(server, app);
server.listen(process.env.PORT || 8081, function () {
  var address = server.address();
  console.log('Listening on '.concat(address.port));
  if (process.env.DEMO_TOWN_ID) {
    CoveyTownsStore_1.default.getInstance().createTown(process.env.DEMO_TOWN_ID, false);
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQThCO0FBQzlCLHlDQUE2QjtBQUM3Qiw4Q0FBd0I7QUFFeEIseURBQTJDO0FBQzNDLDBFQUFvRDtBQUVwRCxJQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUEsY0FBSSxHQUFFLENBQUMsQ0FBQztBQUNoQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXRDLElBQUEsZUFBYSxFQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUUzQixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtJQUN0QyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFpQixDQUFDO0lBRWhELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQWdCLE9BQU8sQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDO0lBQzVDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7UUFDNUIseUJBQWUsQ0FBQyxXQUFXLEVBQUU7YUFDMUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ2hEO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==
