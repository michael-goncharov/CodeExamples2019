const pingpong = require("./pingpong");

// sorting by points
let tour1 = JSON.parse(
    '[{"id":196,"date":"2019-04-23T00:04","playroom":"1","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Dave Nader","user2_id":3},"winner":{"winner_name":null,"winner_id":2},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:0"],"play":null},' +
        '{"id":197,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Dr. Ali Jakubowski","user2_id":4},"winner":{"winner_name":null,"winner_id":4},"tournament":{"tournament_name":"213","tournament_id":27},"score":["0:3"],"play":1},' +
        '{"id":198,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":2},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":199,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dave Nader","user1_id":3},"player_2":{"user2_id_name":"Dr. Ali Jakubowski","user2_id":4},"winner":{"winner_name":null,"winner_id":3},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":200,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dave Nader","user1_id":3},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":5},"tournament":{"tournament_name":"213","tournament_id":27},"score":["1:3"],"play":1},' +
        '{"id":201,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dr. Ali Jakubowski","user1_id":4},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":4},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:0"],"play":1}]'
);
let score1 = [
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":11,"player2_score":9},{"id":814,"player1_score":11,"player2_score":9},{"id":815,"player1_score":0,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    ),
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":4,"player2_score":11},{"id":814,"player1_score":9,"player2_score":11},{"id":815,"player1_score":6,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    ),
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":11,"player2_score":2},{"id":814,"player1_score":11,"player2_score":6},{"id":815,"player1_score":4,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    )
];
let result1 = [
    { place: 1, player_id: "4", points: 5 },
    { place: 2, player_id: "2", points: 5 },
    { place: 3, player_id: "5", points: 4 },
    { place: 4, player_id: "3", points: 4 }
];
// Sorting by sets
let tour2 = JSON.parse(
    '[{"id":196,"date":"2019-04-23T00:04","playroom":"1","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Dave Nader","user2_id":3},"winner":{"winner_name":null,"winner_id":2},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:0"],"play":null},' +
        '{"id":197,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Dr. Ali Jakubowski","user2_id":4},"winner":{"winner_name":null,"winner_id":4},"tournament":{"tournament_name":"213","tournament_id":27},"score":["0:3"],"play":1},' +
        '{"id":198,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":2},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":199,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dave Nader","user1_id":3},"player_2":{"user2_id_name":"Dr. Ali Jakubowski","user2_id":4},"winner":{"winner_name":null,"winner_id":3},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":200,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dave Nader","user1_id":3},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":3},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":201,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dr. Ali Jakubowski","user1_id":4},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":4},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:0"],"play":1}]'
);
let score2 = [
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":11,"player2_score":9},{"id":814,"player1_score":11,"player2_score":9},{"id":815,"player1_score":0,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    ),
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":4,"player2_score":11},{"id":814,"player1_score":9,"player2_score":11},{"id":815,"player1_score":6,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    ),
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":11,"player2_score":2},{"id":814,"player1_score":11,"player2_score":6},{"id":815,"player1_score":4,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    )
];
let result2 = [
    { place: 1, player_id: "4", points: 5 },
    { place: 2, player_id: "2", points: 5 },
    { place: 3, player_id: "3", points: 5 },
    { place: 4, player_id: "5", points: 3 }
];
//sorting by additional data
let tour3 = JSON.parse(
    '[{"id":196,"date":"2019-04-23T00:04","playroom":"1","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Dave Nader","user2_id":3},"winner":{"winner_name":null,"winner_id":2},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":null},' +
        '{"id":197,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Dr. Ali Jakubowski","user2_id":4},"winner":{"winner_name":null,"winner_id":4},"tournament":{"tournament_name":"213","tournament_id":27},"score":["1:3"],"play":1},' +
        '{"id":198,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Antoinette Russel","user1_id":2},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":2},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":199,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dave Nader","user1_id":3},"player_2":{"user2_id_name":"Dr. Ali Jakubowski","user2_id":4},"winner":{"winner_name":null,"winner_id":3},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":200,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dave Nader","user1_id":3},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":3},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:1"],"play":1},' +
        '{"id":201,"date":"2019-04-23T00:04","playroom":"","player_1":{"user1_id_name":"Dr. Ali Jakubowski","user1_id":4},"player_2":{"user2_id_name":"Lucile Mitchell","user2_id":5},"winner":{"winner_name":null,"winner_id":4},"tournament":{"tournament_name":"213","tournament_id":27},"score":["3:0"],"play":1}]'
);
let score3 = [
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":11,"player2_score":9},{"id":814,"player1_score":11,"player2_score":9},{"id":815,"player1_score":0,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    ),
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":4,"player2_score":11},{"id":814,"player1_score":9,"player2_score":11},{"id":815,"player1_score":6,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    ),
    JSON.parse(
        '[{"id":812,"player1_score":11,"player2_score":0},{"id":813,"player1_score":11,"player2_score":2},{"id":814,"player1_score":11,"player2_score":6},{"id":815,"player1_score":4,"player2_score":11},{"id":816,"player1_score":0,"player2_score":0}]'
    )
];

let result3 = [
    { place: 1, player_id: "3", points: 5 },
    { place: 2, player_id: "2", points: 5 },
    { place: 3, player_id: "4", points: 5 },
    { place: 4, player_id: "5", points: 3 }
];

test("checking score 1", () => {
    expect(pingpong.getResult(tour1)).toEqual(result1);
});
test("checking score 2", () => {
    expect(pingpong.getResult(tour2)).toEqual(result2);
});
test("checking score 3", () => {
    expect(pingpong.getResult(tour3, score3)).toEqual(result3);
});
