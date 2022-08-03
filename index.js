const COOKIE_NAME = "webex_kitchen_sink_cookie";
const LOCAL_STORAGE_NAME = "webex_kitchen_sink_localstorage";
const SESSION_STORAGE_NAME = "webex_kitchen_sink_sessionstorage";

var app = new window.Webex.Application();

app.onReady().then(() => {
    log('onReady()', { message: 'host app is ready' })
    app.listen().then(() => {
        app.on('application:displayContextChanged', (payload) => log('application:displayContextChanged', payload));
        app.on('application:shareStateChanged', (payload) => log('application:shareStateChanged', payload));
        app.on('application:themeChanged', (payload) => log('application:themeChanged', payload));
        app.on('meeting:infoChanged', (payload) => log('meeting:infoChanged', payload));
        app.on('meeting:roleChanged', (payload) => log('meeting:roleChanged', payload));
        app.on('space:infoChanged', (payload) => log('space:infoChanged', payload));
        manageUserView();
    })
});

async function manageUserView() {
    await app.context.getMeeting().then((m) => {
        if(m['userRoles'].includes('HOST')) {
            window.location.replace('host.html');
        } else {
            window.location.replace('participant.html');
        }
    }).catch((error) => {
        log('getMeeting() promise failed with error', Webex.Application.ErrorCodes[error]);
    });
}

function log(type, data) {
    var ul = document.getElementById("console");
    var li = document.createElement("li");
    var payload = document.createTextNode(`${type}: ${JSON.stringify(data)}`);
    li.appendChild(payload)
    ul.prepend(li);
}

