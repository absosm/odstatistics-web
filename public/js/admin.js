/*
version: 0.0.7
*/

function get_users() {
  axios.post(`${API_URL}/users`).then(res => {
    var message = res.data;
    if (message.success) {
      var users = message.result;
      // console.log(message);
      var select = Cookies.get('uid');
      users.forEach(u => {
        if (u.uid === select)
          $('#cb_user').append(new Option(u.displayName, u.uid, true, true));
        else
          $('#cb_user').append(new Option(u.displayName, u.uid));
      });
    } else {
      console.log(message.errors);
    }
  });
}

function get_sections(reserved = true) {
  axios.post(`${API_URL}/sections`, { reserved: reserved }).then(res => {
    var message = res.data;
    if (message.success) {
      var sections = message.result;
      var select = Cookies.get('sid');
      sections.forEach(s => {
        if (s.id === select)
          $('#cb_section').append(new Option(s.number, s.id, true, true));
        else
          $('#cb_section').append(new Option(s.number, s.id));
      });
    } else {
      console.log(message.errors);
    }
  });
}

function get_sections_reserved() {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/sections_reserved`).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(message.result);
      } else {
        reject(message.errors)
      }
    });
  })
}

function add_section() {
  const uid = $('#cb_user option:selected').val();
  const l = $('.lbtn-add').ladda();
  l.ladda('start');
  axios.post(`${API_URL}/new_section`,
    {
      link: {
        uid: uid,
        sid: $('#cb_section option:selected').val()
      }
    }).then(res => {
      var message = res.data;
      if (message.success) {
        l.ladda('stop');
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
            window.location.href = 'admin.html';
          }
        });
      } else {
        swal("يوجد خطأ!", message.errors[0].message, "error");
      }
    });
}

function add_group() {
  const section_id = $('#cb_section option:selected').val();
  const l = $('.lbtn-add').ladda();
  l.ladda('start');
  axios.post(`${API_URL}/new_group`,
    {
      group: {
        sid: section_id,
        number: Number($('#tb_group').val()),
      }
    }).then(res => {
      var message = res.data;
      l.ladda('stop');
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
            window.location.href = 'admin.html';
          }
        });
      } else {
        swal("يوجد خطأ!", message.errors[0].message, "error");
      }
    });
}

function get_groups_snum(snum) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/groups_snum`, { snum }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(message.result)
      } else {
        reject(message.errors);
      }
    });
  });
}

function update_baptis(id, data) {
	return new Promise((resolve, reject)=>{
		axios.post(`${API_URL}/update_baptis`, {id, data}).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(true);
			}else {
				reject(message.errors);
			}
		})
	})
}

function delete_baptis(id) {
	return new Promise((resolve, reject)=>{
		axios.post(`${API_URL}/delete_baptis`, {id}).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(true);
			}else {
				reject(message.errors);
			}
		})
	})
}

function get_baptis_types() {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/baptis_types`).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(message.result)
      } else {
        reject(message.errors);
      }
    });
  });
}

function get_numberings_sid(sid) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/numberings_sid`, { sid: sid }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(message.result)
      } else {
        reject(message.errors);
      }
    });
  });
}

function load_menu_numberings(sid) {
  $('#numberings').html('');
  get_numberings_sid(sid).then(numberings => {
    $('#total').html(numberings.length);
    numberings.forEach(numbering => {
      const numbered = (numbering.numbered) ? 'نعم' : 'لا';
      const installed = (numbering.installed) ? 'نعم' : 'لا';
      let li = `<li class="list-group-item">
                <a class="nav-link" data-toggle="tab" href="#tab-1">
                    <small class="float-left text-muted">أولي: ${numbered} | تركيب: ${installed}</small>
                    <strong>${numbering.number}</strong>
                    <div class="small m-t-xs">
                        <span class="m-b-none">
                            ملاحظات: ${numbering.comment}
                        </span>
                    </div>
                    <div class="small m-t-xs">
                        <span class="m-b-none">
                            مجموعة سكانية: ${numbering.group_id}
                        </span>
                    </div>
                </a>
            </li>`;
      $('#numberings').append(li);
    });
  }).catch(errors => {
    console.log(errors);
  })
}