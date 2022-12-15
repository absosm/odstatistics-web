function get_sections(reserved = true) {
    axios.post(`${API_URL}/sections`, {reserved: reserved}).then(res => {
        var message = res.data;
        if (message.success) {
            var sections = message.result;
            var select = Cookies.get('sid');
            sections.forEach(s => {
                if (s.id === select)
                    $('#cb_section').append( new Option(s.number,s.id, true, true) );
                else
                    $('#cb_section').append( new Option(s.number,s.id) );
            });
        }else {
            console.log('error: ' + message.error);
        }
    });
}

function get_users() {
    axios.post(`${API_URL}/users`).then(res => {
        var message = res.data;
        if (message.success) {
            var users = message.result;
            var select = Cookies.get('uid');
            users.forEach(u => {
                if (u.uid === select)
                    $('#cb_user').append( new Option(u.displayName,u.uid, true, true) );
                else
                    $('#cb_user').append( new Option(u.displayName,u.uid) );
            });
        }else {
            console.log('error: ' + message.error);
        }
    });
}

function add_group() {
    const section_id = $('#cb_section option:selected').val();
    axios.post(`${API_URL}/new_group`, 
    {group : {
        sid: section_id,
        number : Number($('#tb_group').val()),
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
                    Cookies.set('sid', section_id);
                    window.location.href = 'newg.html';
                } else {
                window.location.href = '.';
                }
            });
        }else {
            console.log('error: ' + message.error);
        }
    });
}

function add_section() {
    const uid = $('#cb_user option:selected').val();
    axios.post(`${API_URL}/new_section`, 
    {link : {
        uid : uid,
        sid: $('#cb_section option:selected').val()
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
                    Cookies.set('uid', uid);
                    window.location.href = 'news.html';
                } else {
                window.location.href = '.';
                }
            });
        }else {
            console.log('error: ' + message.error);
        }
    });
}