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

function assign_section(uid, sid) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/assign_section`, { uid: uid, sid: sid }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(true);
      } else {
        reject(message.errors);
      }
    });
  })
}

function lock_section(id, lock = true) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/lock_section`, { id: id, lock: lock }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  })
}

function add_group(sid, number) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/new_group`, { sid: sid, number: number }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(true)
      } else {
        reject(message.errors);
      }
    });
  })
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

function add_naming(naming) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/new_naming`, { naming }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(message.result)
      } else {
        reject(message.errors);
      }
    });
  })
}

function update_naming(id, data) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/update_naming`, { id, data }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(true);
      } else {
        reject(message.errors);
      }
    })
  })
}

function delete_naming(id) {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/delete_naming`, { id }).then(res => {
      var message = res.data;
      if (message.success) {
        resolve(true);
      } else {
        reject(message.errors);
      }
    })
  })
}

function get_naming_types() {
  return new Promise((resolve, reject) => {
    axios.post(`${API_URL}/naming_types`).then(res => {
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