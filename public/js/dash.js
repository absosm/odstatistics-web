/*
Vesion 0.0.4
*/

function init_session() {
    return new Promise((resolve, reject) => {
        axios.defaults.withCredentials = true;
        axios.post(`${API_URL}/session`).then(res => {
            const message = res.data;
            if (message.success && message.result) {
                resolve(true);
            }else {
                reject(false);
            }
        });
    });
}

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
            const select = Number(Cookies.get('sid'));
            sections.forEach(s => {
                if (s.number === select)
                    $('#cb_section').append( new Option(s.number,s.id, true, true) );
                else
                    $('#cb_section').append( new Option(s.number,s.id) );
            });

            get_user_group($('#cb_section').val());
        }else {
            console.log('error: ' + message.error);
        }
    });
}

function get_section_dist() {
    axios.post(`${API_URL}/sections_dist`).then(res => {
        var message = res.data;
        if (message.success) {
            const all = message.result;
            all.forEach(result => {
                const user = result.user;
                const sections = result.sections;
                sections.forEach(section => {
                    let li = `<li class="list-group-item">
                        <a class="nav-link" data-toggle="tab" href="#tab-1">
                            <small class="float-left text-muted"><i class="fa fa-map-marker"></i> مقاطعة ${section.number}</small>
                            <strong>${user.displayName}</strong>
                            <div class="small m-t-xs">
                                <span class="m-b-none">
                                    
                                </span>
                            </div>
                        </a>
                    </li>`;

                    $('#sections').append(li);
                })
            });
        }else {
            console.log(message.errors[0]);
        }
    });
}
  
function get_user_group(section_id) {
    axios.post(`${API_URL}/group`, {section_id}).then(res => {
        var message = res.data;
        if (message.success) {
            var groups = message.result;
            var select = undefined;
            if (Cookies.get('gid') !== undefined)
                select = Number(Cookies.get('gid'));
            $('#cb_group').empty();
            groups.forEach(g => {
                if (g.number === select)
                    $('#cb_group').append( new Option(g.number,g.id, true, true) );
                else
                    $('#cb_group').append( new Option(g.number,g.id) );
            });
        }else {
            console.log('error: ' + message.error);
        }
    });
}

function get_statistics() {
    axios.post(`${API_URL}/statistics`).then(res => {
        var message = res.data;
        if (message.success) {
            var statistics = message.result;
            $('#spaces').text(statistics.spaces);
            $('#numberings').text(statistics.numberings);
            $('#sections').text(statistics.sections);
            $('#groups').text(statistics.groups);
        }else {
            console.log('error: ' + message.error);
        }
    });
}
  
function add_space() {
    const sid = Number($('#cb_section option:selected').text());
    const gid = Number($('#cb_group option:selected').text());
    const l = $( '.lbtn-add' ).ladda();
    l.ladda( 'start' );
    axios.post(`${API_URL}/new_space`, 
    {space : {
        section_id: sid,
        group_id : gid,
        type: Number($('#cb_space_type').val()),
        name : $('#tb_space_name').val(),
        named: $('#cb_named').prop('checked'),
        installed: $('#cb_installed').prop('checked'),
        comment:$('#tb_comment').val(),
    }}).then(res => {
        var message = res.data;
        l.ladda( 'stop' );
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
                    Cookies.set('sid', sid);
                    Cookies.set('gid', gid);
                    window.location.href = 'newp.html';
                } else {
                window.location.href = 'paneling.html';
                }
            });
        }else {
            swal("يوجد خطأ!", message.errors[0].message, "error");
        }
    });
}
  
function add_numbering() {

    const sid = Number($('#cb_section option:selected').text());
    const gid = Number($('#cb_group option:selected').text());
    const l = $( '.lbtn-add' ).ladda();
    l.ladda( 'start' );
    axios.post(`${API_URL}/new_numbering`, 
    {numbering : {
        section_id: sid,
        group_id : gid,
        number : $('#tb_number').val(),
        numbered: $('#cb_numbered').prop('checked'),
        installed: $('#cb_installed').prop('checked'),
        comment:$('#tb_comment').val(),
    }}).then(res => {
        var message = res.data;
        l.ladda( 'stop' );
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
                    Cookies.set('sid', sid);
                    Cookies.set('gid', gid);
                    window.location.href = 'newn.html';
                } else {
                    window.location.href = 'numbering.html';
                }
            });
        }else {
            swal("يوجد خطأ!", message.errors[0].message, "error");
        }
    });
}