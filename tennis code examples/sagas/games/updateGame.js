import { call, put } from "redux-saga/effects";

import { GAMES_BASE_URL } from "../../constants/games";
import { updateGameRequestSuccess } from "../../actions/games";

import axios from "../../utils/axios";

export default function* ({ payload: { data, refresh } }) {
    try {
        if (data.date_time.length === 24) {
            data.date_time = data.date_time.slice(0, -8);
        }
        const payload = yield call(() =>
            axios.put(`${GAMES_BASE_URL}/${data.gameId}`, data).then(() => {
                if (process.env.NODE_ENV !== "production") {
                    console.log("Games", data);
                }
                refresh();
            })
        );
        yield put(updateGameRequestSuccess({ data: payload }));
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
