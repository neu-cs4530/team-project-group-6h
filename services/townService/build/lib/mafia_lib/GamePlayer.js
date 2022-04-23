'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Role = exports.Team = void 0;
var Team;
(function (Team) {
  Team[(Team['Mafia'] = 0)] = 'Mafia';
  Team[(Team['Town'] = 1)] = 'Town';
  Team[(Team['Unassigned'] = 2)] = 'Unassigned';
})((Team = exports.Team || (exports.Team = {})));
var Role;
(function (Role) {
  Role[(Role['Unassigned'] = 0)] = 'Unassigned';
  Role[(Role['Detective'] = 1)] = 'Detective';
  Role[(Role['Doctor'] = 2)] = 'Doctor';
  Role[(Role['Hypnotist'] = 3)] = 'Hypnotist';
  Role[(Role['Godfather'] = 4)] = 'Godfather';
})((Role = exports.Role || (exports.Role = {})));
var GamePlayer = (function () {
  function GamePlayer(recPlayer) {
    this._team = Team.Unassigned;
    this._role = Role.Unassigned;
    this._voteTally = 0;
    this._player = recPlayer;
    this._isAlive = true;
    this._currentVote = undefined;
    this._roleInfo = '';
    this._target = undefined;
    this._result = undefined;
  }
  Object.defineProperty(GamePlayer.prototype, 'id', {
    get: function () {
      return this._player.id;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'userName', {
    get: function () {
      return this._player.userName;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'playerConvArea', {
    get: function () {
      return this._player.activeConversationArea;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'playerLocation', {
    get: function () {
      return this._player.location;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'team', {
    get: function () {
      return this._team;
    },
    set: function (team) {
      this._team = team;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'voteTally', {
    get: function () {
      return this._voteTally;
    },
    enumerable: false,
    configurable: true,
  });
  GamePlayer.prototype.resetTally = function () {
    this._voteTally = 0;
  };
  Object.defineProperty(GamePlayer.prototype, 'votedPlayer', {
    set: function (currentVote) {
      this._currentVote = currentVote;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'currentVote', {
    get: function () {
      return this._currentVote;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'targetPlayer', {
    set: function (target) {
      this._target = target;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'target', {
    get: function () {
      return this._target;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'result', {
    get: function () {
      return this._result;
    },
    set: function (result) {
      this._result = result;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'isAlive', {
    get: function () {
      return this._isAlive;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(GamePlayer.prototype, 'roleInfo', {
    get: function () {
      return this._roleInfo;
    },
    enumerable: false,
    configurable: true,
  });
  GamePlayer.prototype.eliminate = function () {
    this._isAlive = false;
  };
  Object.defineProperty(GamePlayer.prototype, 'role', {
    get: function () {
      return this._role;
    },
    set: function (role) {
      this._role = role;
      switch (role) {
        case Role.Detective:
          this._roleInfo =
            'Detective: Able to investigate the role of one (1) player during the night.';
          break;
        case Role.Doctor:
          this._roleInfo = 'Doctor: Can resurrect one (1) player during the night.';
          break;
        case Role.Hypnotist:
          this._roleInfo =
            'Hypnotist: Able to prevent one (1) player from using their ability during the night.';
          break;
        case Role.Godfather:
          this._roleInfo =
            'Godfather: Can override the a mafia decision to eliminate a town member in favor of their own.';
          break;
        default:
          if (this._team === Team.Mafia) {
            this._roleInfo = 'Able to vote to eliminate (1) player during the night.';
          }
          this._roleInfo = 'Able to vote to eliminate (1) player during the day.';
      }
    },
    enumerable: false,
    configurable: true,
  });
  GamePlayer.prototype.vote = function () {
    this._voteTally += 1;
  };
  GamePlayer.prototype.toServerGamePlayer = function () {
    var serverGamePlayer = {
      player: this.id,
      isAlive: this.isAlive,
      currentVote: this.currentVote,
      team: this.team,
      role: this.role,
      roleInfo: this.roleInfo,
      target: this.target,
      result: this.result,
      voteTally: this.voteTally,
    };
    return serverGamePlayer;
  };
  return GamePlayer;
})();
exports.default = GamePlayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FtZVBsYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbWFmaWFfbGliL0dhbWVQbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsSUFBWSxJQUlYO0FBSkQsV0FBWSxJQUFJO0lBQ2QsaUNBQU8sQ0FBQTtJQUNQLCtCQUFNLENBQUE7SUFDTiwyQ0FBWSxDQUFBO0FBQ2QsQ0FBQyxFQUpXLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQUlmO0FBRUQsSUFBWSxJQU1YO0FBTkQsV0FBWSxJQUFJO0lBQ2QsMkNBQVksQ0FBQTtJQUNaLHlDQUFXLENBQUE7SUFDWCxtQ0FBUSxDQUFBO0lBQ1IseUNBQVcsQ0FBQTtJQUNYLHlDQUFXLENBQUE7QUFDYixDQUFDLEVBTlcsSUFBSSxHQUFKLFlBQUksS0FBSixZQUFJLFFBTWY7QUFvQkQ7SUFzQkUsb0JBQVksU0FBaUI7UUFmckIsVUFBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFeEIsVUFBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFReEIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQU1yQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBRUQsc0JBQUksMEJBQUU7YUFBTjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxnQ0FBUTthQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FB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
