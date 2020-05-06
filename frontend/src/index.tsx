import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker'
import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {createLogger} from 'redux-logger'
import rootSaga, {reducer} from "./redux/ducks"
import {Provider} from 'react-redux'
import {createMuiTheme, ThemeProvider} from "@material-ui/core"
import {MuiPickersUtilsProvider} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns";
import {App} from './App'


const logger = createLogger()
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware, logger)
)

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
})

sagaMiddleware.run(rootSaga)


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <App/>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
