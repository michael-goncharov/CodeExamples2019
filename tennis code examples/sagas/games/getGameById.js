import { call, put } from "redux-saga/effects";
import axios from "../../utils/axios";
import { GAMES_BASE_URL } from "../../constants/games";
import { getGameByIdSuccess } from "../../actions/games";

export default function*({ payload: ID }) {
    try {
        const payload = yield call(() =>
            axios.get(`${GAMES_BASE_URL}/${ID}`).then(({ data }) => data)
        );
        yield put(getGameByIdSuccess(payload));
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
