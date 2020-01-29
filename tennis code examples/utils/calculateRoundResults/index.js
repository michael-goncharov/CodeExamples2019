let setPoints;
let _finalResult = [];
let points = [];
let idBox = new Set();
// Find players list
let _getPlayersList = function (response) {
    let players = new Set();
    let allPlayers = new Set();
    let zeroPlayers = new Set();
    response.forEach((game) => {
        allPlayers.add(game.player_1.user1_id);
        allPlayers.add(game.player_2.user2_id);
        if (game.additional_information.length !== 0) {
            game.additional_information.map((playerInfo) => {
                if ((playerInfo.user_id === game.player_1.user1_id && playerInfo.is_disqualified) ||
                    (playerInfo.user_id === game.player_2.user2_id && playerInfo.is_disqualified )) {
                    players.add(game.player_1.user1_id);
                    players.add(game.player_2.user2_id);
                }
            })
        }
        if ((game.score[0][0] === '3') || (game.score[0][2] === '3'))
        {
            players.add(game.player_1.user1_id);
            players.add(game.player_2.user2_id);
        }
    });
    allPlayers.forEach((player) => {
        if (!players.has(player)) {zeroPlayers.add(player)}});
    return ({
        players: players,
        zeroPlayers: zeroPlayers
    })

};

let _getWinner = function (game) {
    let counter = 0;
    const pl1Score = game.score[0][0];
    const pl2Score = game.score[0][2];
    if (!game) {
        return null
    }
    if (game.additional_information.length !== 0) {
        let response = null;
        game.additional_information.forEach((playerInfo) => {
            if (playerInfo.user_id === game.player_1.user1_id && playerInfo.is_disqualified ) {
                counter++} else
            if (playerInfo.user_id === game.player_2.user2_id && playerInfo.is_disqualified ) {
                counter++}
        });
        if (!counter) {
            if (pl1Score > pl2Score) {response =  game.player_1.user1_id}
            if (pl2Score > pl1Score) {response =  game.player_2.user2_id}
        }
        return response
    } else
    if (pl1Score > pl2Score) {return game.player_1.user1_id}
    else if (pl2Score > pl1Score) return game.player_2.user2_id;
    else return null;
};
// Sort by games function
let _sortByGames = function (data, parameters, zeroPlayersArray, checkSum) {

    let innerScore = {};
    let checkSum2 = 0;
    let filteredData = data.filter((element) => {
        let firstId = element.player_1.user1_id;
        let secondId = element.player_2.user2_id;
        return parameters.has(firstId) && parameters.has(secondId);
    });

    filteredData.forEach((game) => {
        let isDisqualified1 = false;
        let isDisqualified2 = false;
        let firstId = game.player_1.user1_id;
        let secondId = game.player_2.user2_id;
        let winnerId = _getWinner(game);

        if (!innerScore[firstId]) {
            innerScore[firstId] = 0;
        }
        if (!innerScore[secondId]) {
            innerScore[secondId] = 0;
        }


        if (game.additional_information.length) {
            game.additional_information.forEach((playerInfo) => {
                if (playerInfo.user_id === firstId && playerInfo.is_disqualified ) {
                    isDisqualified1 = true;
                } else
                if (playerInfo.user_id === secondId && playerInfo.is_disqualified ) {
                    isDisqualified2 = true;
                }
            });
        if (isDisqualified1 && isDisqualified2) {
            innerScore[firstId] += 0;
            innerScore[secondId] += 0;
        } else if (isDisqualified1) {
            innerScore[firstId] += 0;
            innerScore[secondId] += 2;
        } else if (isDisqualified2) {
            innerScore[firstId] += 2;
            innerScore[secondId] += 0;
        } else if (firstId === winnerId) {
            innerScore[firstId] += 2;
            innerScore[secondId] += 1;
        } else if (secondId === winnerId) {
            innerScore[firstId] += 1;
            innerScore[secondId] += 2;
        }

        } else if (firstId === winnerId) {
            innerScore[firstId] += 2;
            innerScore[secondId] += 1;
        } else if (secondId === winnerId) {
            innerScore[firstId] += 1;
            innerScore[secondId] += 2;
        }
    });

    if (!filteredData.length) {
        let iterator1 = parameters.values();

        let firstId = iterator1.next().value;
        let secondId = iterator1.next().value;

        if (!innerScore[firstId]) {
            innerScore[firstId] = 1;
        }
        if (!innerScore[secondId]) {
            innerScore[secondId] = 0;
        }
    }

    let tempResult = Object.entries(innerScore).sort((a, b) => b[1] - a[1]);
    if (!points.length) {
        points = tempResult
    }
    for (let i = 0; i < tempResult.length; i++) {
        let masterElement = tempResult[i][1];
        let tempArr = tempResult.filter((element) => !(element[1] - masterElement));
        if (tempArr.length === 1) {
            _finalResult.push(tempArr[0]);
            checkSum = 0;
        } else {
            checkSum++;
            let par = new Set();
            for (let j = 0; j < tempArr.length; j++) {
                par.add(parseInt(tempArr[j][0]))
            }
            i += tempArr.length - 1;
            if (checkSum > 0) {
                _sortByGames(data, par)
            } else {
                _sortBySets(data, par, checkSum2);
                checkSum = 0;
            }
        }
    }
    if (_finalResult.length + zeroPlayersArray < parameters.size) {
        return []
    } else {
        Array.prototype.push.apply(_finalResult, zeroPlayersArray);
        return _finalResult.map((element, index) => {

            return {
                'place': index + 1,
                'player_id': (index < points.length) ? element[0] : String(element),
                'points': (index < points.length) ? points[index][1] : 0
            }
        });
    }
};
// Sort by sets function
let _sortBySets = function (data, parameters, checkSum2) {
    let innerSetScore = {};
    data.forEach((element) => {
        let firstId = element.player_1.user1_id;
        let secondId = element.player_2.user2_id;
        if (parameters.has(firstId) && parameters.has(secondId)) {
            let firstResult = parseInt(element.score[0].charAt(0));
            let secondResult = parseInt(element.score[0].charAt(2));
            idBox.add(element.id);
            if (!innerSetScore[firstId]) {
                innerSetScore[firstId] = 0;
                innerSetScore[firstId] += firstResult;
                innerSetScore[firstId] -= secondResult;
            } else {
                innerSetScore[firstId] += firstResult;
                innerSetScore[firstId] -= secondResult;
            }
            if (!innerSetScore[secondId]) {
                innerSetScore[secondId] = 0;
                innerSetScore[secondId] += secondResult;
                innerSetScore[secondId] -= firstResult;
            } else {
                innerSetScore[secondId] += secondResult;
                innerSetScore[secondId] -= firstResult;
            }
        }
    });
    let tempSetResult = Object.entries(innerSetScore).sort((a, b) => b[1] - a[1]);
    for (let i = 0; i < tempSetResult.length; i++) {
        let masterElement = tempSetResult[i][1];
        let tempSetArr = tempSetResult.filter((element) => !(element[1] - masterElement));

        if (tempSetArr.length === 1) {
            _finalResult.push(tempSetArr[0]);
            checkSum2 = 0;
        } else {
            checkSum2++;
            let par2 = new Set();
            for (let j = 0; j < tempSetArr.length; j++) {
                par2.add(parseInt(tempSetArr[j][0]))
            }
            i += tempSetArr.length - 1;
            if (checkSum2 === 1) {
                _sortBySets(data, par2)
            } else {
                if (setPoints) {
                    _sortByPoints(data, par2, setPoints);
                    checkSum2 = 0;
                } else {
                }
            }

        }
    }
};
// Sort by points function
let _sortByPoints = function (data, parameters, setPoints) {
    let innerSetScore = {};
    data.forEach((element) => {
        let firstId = element.player_1.user1_id;
        let secondId = element.player_2.user2_id;
        if (parameters.has(firstId) && parameters.has(secondId)) {
            let setPointsIndex = null;
            setPoints.forEach((game, index) => {
                if (game[0].game_id === element.id) setPointsIndex = index;
            });
            let firstResult = setPoints[setPointsIndex].reduce((acc, element) => {
                    acc += element.player1_score;
                    return acc
                }
                , 0);
            let secondResult = setPoints[setPointsIndex].reduce((acc, element) => {
                    acc += element.player2_score;
                    return acc
                }
                , 0);
            if (!innerSetScore[firstId]) {
                innerSetScore[firstId] = 0;
                innerSetScore[firstId] += firstResult;
            } else innerSetScore[firstId] += firstResult;
            if (!innerSetScore[secondId]) {
                innerSetScore[secondId] = 0;
                innerSetScore[secondId] += secondResult;
            } else innerSetScore[secondId] += secondResult;
        }
    });
    let tempSetResult = Object.entries(innerSetScore).sort((a, b) => b[1] - a[1]);

    for (let i = 0; i < tempSetResult.length; i++) {
        let masterElement = tempSetResult[i][1];
        let tempSetArr = tempSetResult.filter((element) => !(element[1] - masterElement));

        if (tempSetArr.length === 1) {
            _finalResult.push(tempSetArr[0]);
        } else {
            let par2 = new Set();
            for (let j = 0; j < tempSetArr.length; j++) {
                par2.add(parseInt(tempSetArr[j][0]))
            }
            i += tempSetArr.length - 1;
            _sortBySets(data, par2)
        }
    }
};
// Main function
let getResult = function (tournament, myPlayersList, scores = 0) {
    _finalResult = [];
    points = [];
    setPoints = scores;
    let checkSum = 0;
    let response = _getPlayersList(tournament);
    let players = response.players;
    let zeroPlayers = response.zeroPlayers;
    let zeroPlayersArray = [...zeroPlayers];
    let sortedArray = _sortByGames(tournament, players, zeroPlayersArray, checkSum);

    if (sortedArray.length) {
        if (process.env.NODE_ENV !== "production") {
            console.log({errorCode: 0, result: sortedArray}, "this is final result");
        }

        return {errorCode: 0, result: sortedArray}
    } else {
        if (process.env.NODE_ENV !== "production") {
            console.log(
                {errorCode: 1, gamesId: idBox},
                "this is partial result"
            );
            return {errorCode: 1, gamesId: idBox}
        }
    }
};

export default getResult;
