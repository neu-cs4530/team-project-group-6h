'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var Player_1 = __importDefault(require('../../types/Player'));
var RecreationPlayer = (function (_super) {
  __extends(RecreationPlayer, _super);
  function RecreationPlayer() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this._isHost = false;
    _this._isSpectator = false;
    return _this;
  }
  RecreationPlayer.prototype.updateSpectator = function () {
    this._isSpectator = true;
  };
  RecreationPlayer.prototype.updateHost = function () {
    this._isHost = true;
  };
  return RecreationPlayer;
})(Player_1.default);
exports.default = RecreationPlayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVjcmVhdGlvblBsYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbWFmaWFfbGliL1JlY3JlYXRpb25QbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4REFBd0M7QUFLeEM7SUFBOEMsb0NBQU07SUFBcEQ7UUFBQSxxRUFrQkM7UUFqQkMsYUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQixrQkFBWSxHQUFHLEtBQUssQ0FBQzs7SUFldkIsQ0FBQztJQVZDLDBDQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBS0QscUNBQVUsR0FBVjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFsQkQsQ0FBOEMsZ0JBQU0sR0FrQm5EIn0=
