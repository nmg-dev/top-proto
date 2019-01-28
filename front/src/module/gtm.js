const EVENT_SCREEN_VIEW = 'tagop.screen.view';
const EVENT_SCREEN_REFRESH = 'tagop.screen.refresh';
const EVENT_USER_LOGIN = 'tagop.user.login';
const EVENT_USER_LOGIN_FAIL = 'tagop.user.login_error';

class GTM {
    // raw push
    static Push(data) {
        if(window.dataLayer && window.dataLayer.push) {
            window.dataLayer.push(data);
        }
    }

    static Event(eventName, options) {
        GTM.Push(Object.assign(options, {event: eventName}));
    }

    static ScreenView(screen) {
        GTM.Event(EVENT_SCREEN_VIEW, {page: screen});
    }

    static RefreshScreen(screen, options) {
        GTM.Event(EVENT_SCREEN_REFRESH, Object.assign(options, {page: screen}));
    }

    static UserLogin(guid) {
        GTM.Event(EVENT_USER_LOGIN, {guid: guid});
    }

    static UserLoginError(error) {
        GTM.Event(EVENT_USER_LOGIN_FAIL, {error: error});
    }
}

export default GTM;