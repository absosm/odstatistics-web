/*
version: 0.0.2
*/
var sentCodeId = null, phoneNumber = null;

$('#phone').on('change', function () {
  phoneNumber = $('#phone').val();
  const regexpPhone = /(\+213|0)([0-9]{9})/;
  const match = phoneNumber.match(regexpPhone);
  if (match != null) {
    phoneNumber = (match[1] == '0') ? '+213' + match[2] : match[1] + match[2];
    $('#recaptcha-container').show();
  } else {
    phoneNumber = null;
    $('#recaptcha-container').hide();
  }
})

// window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  'size': 'normal',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    // ...
    if (phoneNumber == null) {
      console.log('phone number is null');
      $('#btn_login').prop('disabled', true);
      $('#code').hide();
      $('.custom-alert').html(`يجب إدخال رقم الهاتف قبل تأكيد كابتشا.`);
      $('.custom-alert').fadeIn();
    } else {
      $('#btn_login').prop('disabled', false);
      $('#code').show();
      sendVerificationCode(phoneNumber).then(code => {
        sentCodeId = code;
        // console.log('sent code is:', sentCodeId);
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
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        resolve(confirmationResult.verificationId);
      })
  });
}

function signInWithPhone(sentCodeId, code) {
  return new Promise(resolve => {
    const credential = firebase.auth.PhoneAuthProvider.credential(sentCodeId, code);
    firebase.auth().signInWithCredential(credential).then((userCredential) => {
      firebase.auth().currentUser.getIdToken().then(function (idToken) {
        axios.post(`${API_URL}/login`,
          JSON.stringify({ idToken }),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }).then(res => {
            var message = res.data;
            if (message.success) {
              window.location.href = './';
              resolve(true);
            } else {
              console.log(message.errors);
            }
            firebase.auth().signOut();
          });
      }).catch(error => {
        console.log(error);
        resolve(false);
      });
    }).catch(error => {
      console.log(error);
      resolve(false);
    });
  });
}