import { call, put } from "redux-saga/effects";

import { GAMES_BASE_URL } from "../../constants/games";
import { createGameSuccess } from "../../actions/games";
import { getGamesByTournament } from "../../actions/tournaments";

import axios from "../../utils/axios";

export default function*({ payload: gameInfo }) {
    console.log("GameInfo", gameInfo);
    try {
        yield call(() =>
            axios.post(GAMES_BASE_URL, { ...gameInfo }).then(({ data }) => data)
        );
        yield put(createGameSuccess(gameInfo));
        yield put(getGamesByTournament(gameInfo.tournament_id));
    } catch ({ message }) {
        console.warn("MESSAGE", message);
    }
}
