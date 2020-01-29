import { call, put } from "redux-saga/effects";
import axios from "../../utils/axios";
import { ALL_GAMES_BASE_URL } from "../../constants/games";
import { getAllGamesSuccess } from "../../actions/games";

export default function*() {
    try {
        const payload = yield call(() =>
            axios.get(ALL_GAMES_BASE_URL).then(({ data }) => data)
        );
        yield put(getAllGamesSuccess(payload));
    } catch ({ message }) {
        console.log("MESSAGE", message);
    }
}
