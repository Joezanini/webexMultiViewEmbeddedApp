const COOKIE_NAME = "webex_kitchen_sink_cookie";
const LOCAL_STORAGE_NAME = "webex_kitchen_sink_localstorage";
const SESSION_STORAGE_NAME = "webex_kitchen_sink_sessionstorage";

var app = new window.Webex.Application();
const url = 'PASTE THE START PAGE URL HERE'

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
        handleSetShare();
    })
});

/*
Function : handleSetShare()
Description : assigns the set share url for the embedded App
              API framework. It fires when app.OnReady is 
              implemented.
*/
function handleSetShare() {
    if (app.isShared) {
      log('ERROR: setShareUrl() should not be called while session is active');
      return;
    }
    
    app.setShareUrl(url, url, 'Embedded App with Different Views').then(() => {
        log('setShareUrl()', { message: 'shared url to participants panel', url: url })
    }).catch((error) => {
        log('setShareUrl() failed with error', Webex.Application.ErrorCodes[error]);
    });
}
/*
Function : manageUserView()
Description : once the app loads for a m
              meeting participant, the function
              checks the participants role in 
              the meeting and deligates the content
              that is visible to the participant
*/
function manageUserView() {
    app.context.getMeeting().then((m) => {
        if(m['userRoles'].includes('HOST') || m['userRoles'].includes('COHOST')) {
            window.location.replace('host.html');
        } else {
            window.location.replace('participant.html');
        }
    }).catch((error) => {
        log('getMeeting() promise failed with error', Webex.Application.ErrorCodes[error]);
    });
}

/*
Function : log()
Description : loging wrapper for debugging.
*/
function log(type, data) {
    var ul = document.getElementById("console");
    var li = document.createElement("li");
    var payload = document.createTextNode(`${type}: ${JSON.stringify(data)}`);
    li.appendChild(payload)
    ul.prepend(li);
}

