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
        var message = res.data;
        if (message.success) {
            var sections = message.result;
            sections.forEach(s => {
                $('#cb_section').append( new Option(s.number,s.id) );
            });

            get_user_group($('#cb_section').val());
        }else {
            console.log('error: ' + message.error);
        }
    });
}
  
function get_spaces_count() {
    var ref = firebase.database().ref('section/' + uid + '/');
    ref.once('value', (snapshot) => {
        console.log(snapshot.size);
    });
}
  
function get_user_group(section_id) {

    axios.post(`${API_URL}/group`, {section_id}).then(res => {
        var message = res.data;
        if (message.success) {
            var groups = message.result;
            $('#cb_group').empty();
            groups.forEach(g => {
                $('#cb_group').append( new Option(g.number,g.id) );
            });
        }else {
            console.log('error: ' + message.error);
        }
    });
}
  
function add_espace() {
    axios.post(`${API_URL}/new_space`, 
    {space : {
        section_id: Number($('#cb_section option:selected').text()),
        group_id : Number($('#cb_group option:selected').text()),
        type: Number($('#cb_space_type').val()),
        name : $('#tb_space_name').val(),
        named: $('#cb_named').prop('checked'),
        installed: $('#cb_installed').prop('checked'),
        comment:$('#tb_comment').val(),
    }}).then(res => {
        var message = res.data;
        if (message.success) {
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
        }else {
            console.log('error: ' + message.error);
        }
    });
}
  
function add_numbering() {
    axios.post(`${API_URL}/new_numbering`, 
    {numbering : {
        section_id: Number($('#cb_section option:selected').text()),
        group_id : Number($('#cb_group option:selected').text()),
        number : $('#tb_number').val(),
        numbered: $('#cb_numbered').prop('checked'),
        installed: $('#cb_installed').prop('checked'),
        comment:$('#tb_comment').val(),
    }}).then(res => {
        var message = res.data;
        if (message.success) {
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
        }else {
            console.log('error: ' + message.error);
        }
    });
}