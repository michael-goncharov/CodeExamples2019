import { call, put } from "redux-saga/effects";
import axios from "../../utils/axios";
import { GAMES_BASE_URL } from "../../constants/games";
import { getSetsByGameSuccess } from "../../actions/games";

export default function*({ payload: ID }) {
    try {
        const payload = yield call(() =>
            axios.get(`${GAMES_BASE_URL}/${ID}/sets`).then(({ data }) => data)
        );
        yield put(getSetsByGameSuccess(payload));
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
