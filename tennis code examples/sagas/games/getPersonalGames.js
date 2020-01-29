import { put, all } from "redux-saga/effects";
import axios from "../../utils/axios";
import { BASE_PLAYERS_REQUEST_URL } from "../../constants/players";
import { getPersonalGamesActionSuccess } from "../../actions/games";

export default function*({ payload }) {
    try {
        const [gamesPlayer1, gamesPlayer2] = yield all([
            axios.get(`${BASE_PLAYERS_REQUEST_URL}/${payload.player1}/games`),
            axios.get(`${BASE_PLAYERS_REQUEST_URL}/${payload.player2}/games`)
        ]);

        yield put(
            getPersonalGamesActionSuccess({
                gamesPlayer1: gamesPlayer1.data,
                gamesPlayer2: gamesPlayer2.data,
                idPlayer1: payload.player1,
                idPlayer2: payload.player2
            })
        );
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
