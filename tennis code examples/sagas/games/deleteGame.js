import { call, put } from "redux-saga/effects";

import { GAMES_BASE_URL } from "../../constants/games";
import { deleteGameRequestSuccess } from "../../actions/games";

import axios from "../../utils/axios";

export default function*({ payload: { data, refresh } }) {
    try {
        const payload = yield call(() =>
            axios.post(`${GAMES_BASE_URL}/${data.gameId}`, data).then(() => {
                refresh();
            })
        );
        yield put(deleteGameRequestSuccess({ data: payload }));
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
