'use strict';
(() => {

    let playerDirector = (function() {
        let players = {}, // 保存所有玩家
            operations = {}; // 中介者可以执行的操作

        /*新增一个玩家*/
        operations.addPlayer = function(player) {
            let teamColor = player.teamColor; // 玩家的队伍的颜色
            players[teamColor] = players[teamColor] || []; // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍

            players[teamColor].push(player); // 添加玩家进队伍
        };

        /*移除一个玩家*/
        operations.removePlayer = function(player) {
            let teamColor = player.teamColor, // 玩家的队伍的颜色
                teamPlayers = players[teamColor]; // 该队的所有成员
            for (let i = teamPlayers.length - 1; i >= 0; i--) {
                if (teamPlayers[i] === player) {
                    teamPlayers.splice(i, 1);
                }
            }
        };

        /*玩家换队*/
        operations.changeTeam = function(player, newTeamColor) {
            operations.removePlayer(player); // 从原队伍中删除
            player.teamColor = newTeamColor; // 改变队伍颜色
            operations.addPlayer(player); // 添加到新队伍中
        };

        /*玩家死亡*/
        operations.playerDead = function(player) {
            let teamColor = player.teamColor,
                teamPlayers = players[teamColor]; // 所在队伍所有成员

            let all_dead = true;

            for (let player of teamPlayers) {
                if (player.state !== 'dead') {
                    all_dead = false;
                    break;
                }
            }

            if (all_dead === true) {
                for (let teamPlayer of teamPlayers) {
                    teamPlayer.lose(); // 本队所有玩家lose
                }

                for (let color in players) {
                    if (color !== teamColor) {
                        let teamPlayers = players[color]; // 所有其他队伍玩家
                        for (let otherPlayer of teamPlayers) {
                            otherPlayer.win(); // 其他队伍所有玩家胜利
                        }
                    }
                }
            }
        };

        let ReceiveMessage = function() {
            let message = Array.prototype.shift.call(arguments); // 第一个参数为消息名称
            operations[message].apply(this, arguments);
        }

        return {
            ReceiveMessage
        }
    })();

    function Player(name, teamColor) {
        this.name = name; // 角色名
        this.teamColor = teamColor; // 所在队伍
        this.state = 'live' // 生存状态
    }

    Player.prototype.win = function() {
        console.log(this.name + ' won');
    }

    Player.prototype.lose = function() {
        console.log(this.name + ' lost');
    }

    /*玩家死亡*/
    Player.prototype.die = function() {
        this.state = 'dead';
        playerDirector.ReceiveMessage('playerDead', this); // 向中介者发送消息
    };

    /*玩家换队*/
    Player.prototype.changeTeam = function(color) {
        playerDirector.ReceiveMessage('changeTeam', this, color); // 给中介者发送消息
    }

    let playerFactory = function(name, teamColor) {
        let newPlayer = new Player(name, teamColor);
        playerDirector.ReceiveMessage('addPlayer', newPlayer);

        return newPlayer;
    };

    let player1 = playerFactory('老王', 'defence'),
        player2 = playerFactory('小丑', 'defence'),
        player3 = playerFactory('solid cat', 'defence'),
        player4 = playerFactory('小岛', 'defence');

    let player5 = playerFactory('黄毛', 'attack'),
        player6 = playerFactory('老爷', 'attack'),
        player7 = playerFactory('liquid cat', 'attack'),
        player8 = playerFactory('可乐美', 'attack');

    player1.die();
    player2.changeTeam('attack');
    player3.die();
    player4.die();
})();
