/*
Vesion 0.0.9
*/
axios.defaults.withCredentials = true;

function init_session() {
    return new Promise((resolve, reject) => {
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

function get_sections_uid() {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/sections_uid`).then(res => {
            var message = res.data;
            if (message.success) {
                resolve(message.result)
            }else {
                reject(message.errors);
            }
        });
    });
}

function load_cb_sections() {
    get_sections_uid().then(sections=>{
        const select = Number(Cookies.get('sid'));
        sections.forEach(s => {
            if (s.number === select)
                $('#cb_section').append( new Option(s.number,s.id, true, true) );
            else
                $('#cb_section').append( new Option(s.number,s.id) );
        });

        load_cb_groups($('#cb_section').val());
    }).catch(errors=>{
        console.log(errors[0]);
    })
}

function get_section_dist() {
    axios.post(`${API_URL}/sections_dist`).then(res => {
        var message = res.data;
        if (message.success) {
            const sections = message.result;
            sections.forEach(result => {
                const _user = result.user;
                const _section = result.section;
                let li = `<li class="list-group-item">
                    <a class="nav-link" data-toggle="tab" href="#tab-1">
                        <small class="float-left text-muted">
                            <i class="fa fa-map-marker"></i> مقاطعة ${_section.number}
                        </small>
                        <strong>${_user.displayName}</strong>
                        <div class="small m-t-xs">
                            <span class="m-b-none">
                                
                            </span>
                        </div>
                    </a>
                </li>`;
                $('#sections').append(li);
            });
        }else {
            console.log(message.errors[0]);
        }
    });
}

function get_groups_sid(sid) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/groups_sid`, {sid}).then(res => {
            var message = res.data;
            if (message.success) {
                resolve(message.result)
            }else {
                reject(message.errors);
            }
        });
    });
}
  
function load_cb_groups(sid) {
    $('#cb_group').empty();
    get_groups_sid(sid).then(groups => {
        var select = undefined;
        if (Cookies.get('gid') !== undefined)
            select = Number(Cookies.get('gid'));
        groups.forEach(g => {
            if (g.number === select)
                $('#cb_group').append( new Option(g.number,g.id, true, true) );
            else
                $('#cb_group').append( new Option(g.number,g.id) );
        });
        if($('#cb_numbering').length > 0) {
            load_cb_numberings(Number($('#cb_group option:selected').text()));
        }
        if($('#cb_space').length > 0) {
            load_cb_spaces(Number($('#cb_group option:selected').text()));
        }
        if($('#numberings').length > 0) {
            load_menu_numberings(Number($('#cb_group option:selected').text()));
        }
        if($('#spaces').length > 0) {
            load_menu_spaces(Number($('#cb_group option:selected').text()));
        }
    }).catch(errors=>{
        console.log(errors[0]);
    })
}

function get_spaces_gid(gid) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/spaces_gid`, {gid: gid}).then(res => {
            var message = res.data;
            if (message.success) {
                resolve(message.result)
            }else {
                reject(message.errors);
            }
        });
    });
}

function load_cb_spaces(gid) {
    $('#cb_space').empty();
    get_spaces_gid(gid).then(spaces=>{
        spaces.forEach(s => {
            $('#cb_space').append( new Option(s.name,s.id) );
        });
    }).catch(errors=>{
        console.log(errors[0]);
    })
}

function load_menu_spaces(gid) {

    const types = ['أخرى', 'شارع', 'طريق', 'نهج', 'مسلك', 
    'معبر', 'حي', 'تجمع سكاني', 'تجزئة', 'حديقة', 'ساحة', 'حظيرة', 
    'غابة', 'معلم تذكاري', 'آثار تاريخية', 'مؤسسة'];

    $('#spaces').html('');
    get_spaces_gid(gid).then(spaces=>{
        spaces.forEach(space => {
            const named = (space.named)?'نعم':'لا';
            const installed = (space.installed)?'نعم':'لا';
            let li = `<li class="list-group-item">
                <a class="nav-link" data-toggle="tab" href="#tab-1">
                    <small class="float-left text-muted">أولي: ${named} | تركيب: ${installed}</small>
                    <strong>(${types[space.type]})</strong>
                    <div class="small m-t-xs">
                        <span class="m-b-none">
                            تسمية: ${space.name}
                        </span>
                    </div>
                    <div class="small m-t-xs">
                        <span class="m-b-none">
                            ملاحظات: ${space.comment}
                        </span>
                    </div>
                </a>
            </li>`;
            $('#spaces').append(li);
        });
    }).catch(errors=>{
        console.log(errors[0]);
    })
}

function delete_space(id) {
    const sid = Number($('#cb_section option:selected').text());
    const gid = Number($('#cb_group option:selected').text());
    swal({
        title: "هل أنت متأكد!",
        text: "أنت بصدد حذف تسمية فضاء، هل أنت متأكد؟",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#016AD9",
        confirmButtonText: "نعم واصل",
        cancelButtonText: "إلغاء",
        closeOnConfirm: false
    }, function (isConfirm) {
        if (isConfirm) {
            Cookies.set('sid', sid);
            Cookies.set('gid', gid);
            axios.post(`${API_URL}/delete_space`, {id}).then(res => {
                var message = res.data;
                if (message.success) {
                    window.location.href = 'delp.html';
                }else {
                    swal("خطأ!", "لا يتم", "error");
                }
            })
        }
    });
}

function get_numberings_gid(gid) {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/numberings_gid`, {gid: gid}).then(res => {
            var message = res.data;
            if (message.success) {
                resolve(message.result)
            }else {
                reject(message.errors);
            }
        });
    });
}

function load_menu_numberings(gid) {
    $('#numberings').html('');
    get_numberings_gid(gid).then(numberings=>{
        numberings.forEach(numbering => {
            const numbered = (numbering.numbered)?'نعم':'لا';
            const installed = (numbering.installed)?'نعم':'لا';
            let li = `<li class="list-group-item">
                <a class="nav-link" data-toggle="tab" href="#tab-1">
                    <small class="float-left text-muted">أولي: ${numbered} | تركيب: ${installed}</small>
                    <strong>${numbering.number}</strong>
                    <div class="small m-t-xs">
                        <span class="m-b-none">
                            ملاحظات: ${numbering.comment}
                        </span>
                    </div>
                </a>
            </li>`;
            $('#numberings').append(li);
        });
    }).catch(errors=>{
        console.log(errors[0]);
    })
}

function load_cb_numberings(gid) {
    $('#cb_numbering').empty();
    get_numberings_gid(gid).then(numberings=>{
        numberings.forEach(n => {
            $('#cb_numbering').append( new Option(n.number,n.id) );
        });
    }).catch(errors=>{
        console.log(errors[0]);
    })
}

function delete_numbering(id) {
    const sid = Number($('#cb_section option:selected').text());
    const gid = Number($('#cb_group option:selected').text());
    swal({
        title: "هل أنت متأكد!",
        text: "أنت بصدد حذف ترقيم بناية، هل أنت متأكد؟",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#016AD9",
        confirmButtonText: "نعم واصل",
        cancelButtonText: "إلغاء",
        closeOnConfirm: false
    }, function (isConfirm) {
        if (isConfirm) {
            Cookies.set('sid', sid);
            Cookies.set('gid', gid);
            axios.post(`${API_URL}/delete_numbering`, {id}).then(res => {
                var message = res.data;
                if (message.success) {
                    window.location.href = 'deln.html';
                }else {
                    swal("خطأ!", "لا يتم", "error");
                }
            })
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
                confirmButtonColor: "#016AD9",
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
                confirmButtonColor: "#016AD9",
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