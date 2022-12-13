// Initialize Firebase
var database = firebase.database();

$(document).ready(() => {
    axios.defaults.withCredentials = true;
    axios.post(`${API_URL}/session`).then(res => {
        const message = res.data;
        if (message.success && message.result) {
            $('.fullbox-loading').remove('.sk-loading');
        }else {
            window.location.href = 'login.html';
        }
    });
});

function logout() {
    axios.get(`${API_URL}/logout`).then(res => {
        var message = res.data;
        if (message.success) {
            window.location.href = './login.html';
        }else {
            alert('error');
        }
    });
}

function get_user_sections() {

    axios.post(`${API_URL}/section`).then(res => {

    });

    // var ref = firebase.database().ref('section/' + uid);
    // ref.once('value', (snapshot) => {
    //     var finished = false;
    //     $('#cb_section').empty();
    //     snapshot.forEach(child => {
    //     finished = child.val().finished;
    //     if (!finished) {
    //         $('#cb_section').append( new Option(child.key,child.key) );
    //     }
    //     });
    //     get_user_group($('#cb_section').val());
    // });
}
  
function get_spaces_count() {
    var ref = firebase.database().ref('section/' + uid + '/');
    ref.once('value', (snapshot) => {
        console.log(snapshot.size);
    });
}
  
function get_user_group(section_id) {
    var ref = firebase.database().ref(
        'section/' + uid + '/' + section_id + '/group'
        );
    ref.once('value', (snapshot) => {
        var finished = false;
        $('#cb_group').empty();
        $('#cb_group').append( new Option('لا توجد',0) );
        snapshot.forEach(child => {
        if (child.key >= 1) {
            finished = child.val().finished;
            if (!finished) {
            $('#cb_group').append( new Option(child.key,child.key) );
            }
        }
        });
    });
}
  
function add_espace() {
    const section_id = $('#cb_section').val();
    const group_id = $('#cb_group').val();
    var ref = firebase.database().ref(
        'section/' + uid + '/' + section_id + '/group/' + 
        group_id + '/spaces'
        );
    var space_id = ref.push().key;
    ref.child(space_id).set({
        space_type: $('#cb_space_type').val(),
        space_name : $('#tb_space_name').val(),
        named: $('#cb_named').prop('checked'),
        installed: $('#cb_installed').prop('checked'),
        comment:$('#tb_comment').val(),
    }, (error) => {
        if (error) {
        // The write failed...
        console.log(error);
        } else {
        // Data saved successfully!
        swal({
            title: "نجت العملية!",
            text: "تم إدخال المعطيات بنجاح!هل تريد المواصلة",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "نعم واصل",
            cancelButtonText: "إلغاء",
            closeOnConfirm: false
        }, function (isConfirm) {
            if (isConfirm) {
            window.location.href = 'newp.html';
            } else {
            window.location.href = 'paneling.html';
            }
        });
        console.log('Data saved successfully!');
        }
    });
}
  
function add_numbering() {
    const section_id = $('#cb_section').val();
    const group_id = $('#cb_group').val();
    var ref = firebase.database().ref(
        'section/' + uid + '/' + section_id + '/group/' + 
        group_id + '/numberings'
        );
    var numbering_id = ref.push().key;
    ref.child(numbering_id).set({
        number: $('#tb_number').val(),
        numbered: $('#cb_numbered').prop('checked'),
        installed: $('#cb_installed').prop('checked'),
        comment:$('#tb_comment').val(),
    }, (error) => {
        if (error) {
        // The write failed...
        console.log(error);
        } else {
        // Data saved successfully!
        swal({
            title: "نجت العملية!",
            text: "تم إدخال المعطيات بنجاح!هل تريد المواصلة",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "نعم واصل",
            cancelButtonText: "إلغاء",
            closeOnConfirm: false
        }, function (isConfirm) {
            if (isConfirm) {
            window.location.href = 'newn.html';
            } else {
            window.location.href = 'numbering.html';
            }
        });
        console.log('Data saved successfully!');
        }
    });
}