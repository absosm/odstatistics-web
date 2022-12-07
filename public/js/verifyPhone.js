var sentCodeId = null, phoneNumber=null;

// window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        if (phoneNumber == null) {
            console.log('phone number is null');
        }else {
            sendVerificationCode(phoneNumber).then(code=>{
                sentCodeId = code;
                console.log('sent code is:', sentCodeId);
                $('#recaptcha-container').hide();
            })
        }
    },
    'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
    }
});

recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
})

function sendVerificationCode(phoneNumber) {
    return new Promise(resolve => {
        const appVerifier = window.recaptchaVerifier;
        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            resolve(confirmationResult.verificationId);
        })
    });
}

function signInWithPhone(sentCodeId, code){

    return new Promise(resolve => {
        const credential = firebase.auth.PhoneAuthProvider.credential(sentCodeId, code);
        auth.signInWithCredential(credential).then((userCredential) => {

            // auth.currentUser.getIdToken().then(function(idToken) {
            //     axios.post(`${API_URL}/verify_phone`, 
            //         JSON.stringify({ idToken }), 
            //         {headers: {
            //             Accept: "application/json",
            //             "Content-Type": "application/json"
            //         } 
            //     }).then(res=>{
            //         var message = res.data;
            //         if (message.success) {
            //             window.location.href = './';
            //         }else {
            //             console.log('error:',message.errors);
            //         }
            //         firebase.auth().signOut();
            //     });
            // }).catch(error=>{
            //     console.log('getIdToken()',error);
            // });

            resolve(true);
        }).catch(error => {
            console.log(error);
            resolve(false);
        });
    });
}

$(document).ready(() => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        // ...
        console.log(`user ${uid} is logged`);

        } else {
        // User is signed out
        // ...
        console.log(`user logout`);
        }
    });

    // axios.post(`${API_URL}/session`).then(res => {
    //     const message = res.data;
    //     if (message.success) {
    //         user = message.result;
    //         if (user.phoneVerified) {
    //             window.location.href = './';
    //             return;
    //         }
    //         phoneNumber = user.phoneNumber;
    //         $('.fullbox-loading').remove('.sk-loading');
    //     }else {
    //         console.log('session expired');
    //         window.location.href = 'login.html'
    //     }
    // });
});