'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var nanoid_1 = require('nanoid');
var PlayerSession = (function () {
  function PlayerSession(player) {
    this._player = player;
    this._sessionToken = (0, nanoid_1.nanoid)();
  }
  Object.defineProperty(PlayerSession.prototype, 'videoToken', {
    get: function () {
      return this._videoToken;
    },
    set: function (value) {
      this._videoToken = value;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(PlayerSession.prototype, 'player', {
    get: function () {
      return this._player;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(PlayerSession.prototype, 'sessionToken', {
    get: function () {
      return this._sessionToken;
    },
    enumerable: false,
    configurable: true,
  });
  return PlayerSession;
})();
exports.default = PlayerSession;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxheWVyU2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9QbGF5ZXJTZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWdDO0FBT2hDO0lBVUUsdUJBQVksTUFBYztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUEsZUFBTSxHQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELHNCQUFJLHFDQUFVO2FBSWQ7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDMUIsQ0FBQzthQU5ELFVBQWUsS0FBeUI7WUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDM0IsQ0FBQzs7O09BQUE7SUFNRCxzQkFBSSxpQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksdUNBQVk7YUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQzs7O09BQUE7SUFDSCxvQkFBQztBQUFELENBQUMsQUEvQkQsSUErQkMifQ==
