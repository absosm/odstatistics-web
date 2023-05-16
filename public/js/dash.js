/*
Vesion 0.0.17
last modifed 25/04/2023 16:16
*/
axios.defaults.withCredentials = true;

function init_session() {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/session`).then(res => {
			const message = res.data;
			if (message.success && message.result) {
				resolve(message.result);
			} else {
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
		} else {
			alert('error');
		}
	});
}

function append_menu(menu_item, submenu = false) {
	const li = $(`<li></li>`), a = $(`<a ${(menu_item.id !== undefined) ? 'class="' + menu_item.id + '" ' : ''}href="${menu_item.url}"></a>`),
		i = $(`<i class="fa ${menu_item.icon}"></i>`), arrow = $(`<span class="fa arrow">`);
	span = $(`<span class="nav-label"> ${menu_item.text} </span>`),
		ul = $(`<ul class="nav nav-second-level collapse"></ul>`);
	a.append(i);
	a.append(span);
	li.append(a);
	if (submenu) {
		a.append(arrow);
		Object.keys(menu_item.submenu).forEach(key => {
			const _sub = menu_item.submenu[key];
			const item = $(`<li><a ${(_sub.id !== undefined) ? 'class="' + _sub.id
				+ '" ' : ''}href="${_sub.url}"> ${_sub.text} </a></li>`);
			if (window.location.pathname === _sub.url) {
				item.addClass('active');
				li.addClass('active');
			}
			ul.append(item);
		})
		li.append(ul);
	}
	if (window.location.pathname === menu_item.url) li.addClass('active');
	$('#side-menu').append(li);
}

function load_sidebar() {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/load_sidebar`).then(res => {
			var message = res.data;
			if (message.success) {
				$(".metismenu").metisMenu('dispose');
				let sidebar = message.result;
				Object.keys(sidebar).forEach(key => {
					const menu_item = sidebar[key];
					if (menu_item.submenu === null) {
						append_menu(menu_item);
					} else {
						append_menu(menu_item, true);
					}
				})
				$(".metismenu").metisMenu();
				resolve(sidebar);
			} else {
				reject(message.errors);
			}
		});
	});
}

$('.metismenu').on('click', '.ajax_download', function (e) {
	e.preventDefault();
	axios({
		url: `${API_URL}/` + $(this).attr('href'),
		method: 'GET',
		responseType: 'blob', // important
	}).then((response) => {
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'report.pdf');
		document.body.appendChild(link);
		link.click();
	});
})

function get_sections_uid(inclusion_ends) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/sections_uid`, { inclusion_ends }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(message.result)
			} else {
				reject(message.errors);
			}
		});
	});
}

function load_cb_sections(inclusion_ends) {
	get_sections_uid(inclusion_ends).then(sections => {
		const select = Number(Cookies.get('sid'));
		sections.forEach(s => {
			if (s.number == select)
				$('#cb_section').append(new Option(s.number, s.id, true, true));
			else
				$('#cb_section').append(new Option(s.number, s.id));
		});
		load_cb_groups($('#cb_section').val());
	}).catch(errors => {
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
							${(_section.end) ? '<i class="fa fa-thumbs-o-up"></i>' : ''}
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
		} else {
			console.log(message.errors[0]);
		}
	});
}

function get_groups_sid(sid) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/groups_sid`, { sid }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(message.result)
			} else {
				reject(message.errors);
			}
		});
	});
}

function load_cb_groups(sid) {
	$('#cb_group').empty();
	get_groups_sid(sid).then(groups => {
		var select = undefined;
		if (Cookies.get('gid') !== undefined) {
			select = Number(Cookies.get('gid'));
			console.log(select);
		}
		groups.forEach(g => {
			if (g.number == select)
				$('#cb_group').append(new Option(g.number, g.id, true, true));
			else
				$('#cb_group').append(new Option(g.number, g.id));
		});
		if ($('#cb_numbering').length > 0) {
			load_cb_numberings(Number($('#cb_group option:selected').text()));
		}
		if ($('#cb_space').length > 0) {
			load_cb_spaces(Number($('#cb_group option:selected').text()));
		}
		if ($('#numberings').length > 0) {
			load_menu_numberings(Number($('#cb_group option:selected').text()));
		}
		if ($('#spaces').length > 0) {
			load_menu_spaces(Number($('#cb_group option:selected').text()));
		}
	}).catch(errors => {
		console.log(errors[0]);
	})
}

function get_spaces_gid(gid) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/spaces_gid`, { gid: gid }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(message.result)
			} else {
				reject(message.errors);
			}
		});
	});
}

function load_cb_spaces(gid) {
	$('#cb_space').empty();
	get_spaces_gid(gid).then(spaces => {
		spaces.forEach(s => {
			$('#cb_space').append(new Option(s.name, s.id));
		});
	}).catch(errors => {
		console.log(errors[0]);
	})
}

function load_menu_spaces(gid) {
	const types = ['أخرى', 'شارع', 'طريق', 'نهج', 'مسلك',
		'معبر', 'حي', 'تجمع سكاني', 'تجزئة', 'حديقة', 'ساحة', 'حظيرة',
		'غابة', 'معلم تذكاري', 'آثار تاريخية', 'مؤسسة'];

	$('#spaces').html('');
	get_spaces_gid(gid).then(spaces => {
		spaces.forEach(space => {
			const named = (space.named) ? 'نعم' : 'لا';
			const installed = (space.installed) ? 'نعم' : 'لا';
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
	}).catch(errors => {
		console.log(errors[0]);
	})
}

function update_space(id, data) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/update_space`, { id, data }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(true);
			} else {
				reject(message.errors);
			}
		})
	})
}

function delete_space(id) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/delete_space`, { id }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(true);
			} else {
				reject(message.errors);
			}
		})
	})
}

function get_numberings_gid(gid) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/numberings_gid`, { gid: gid }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(message.result)
			} else {
				reject(message.errors);
			}
		});
	});
}

function load_menu_numberings(gid) {
	$('#numberings').html('');
	get_numberings_gid(gid).then(numberings => {
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
				</a>
			</li>`;
			$('#numberings').append(li);
		});
	}).catch(errors => {
		console.log(errors[0]);
	})
}

function load_cb_numberings(gid) {
	$('#cb_numbering').empty();
	get_numberings_gid(gid).then(numberings => {
		numberings.forEach(n => {
			$('#cb_numbering').append(new Option(n.number, n.id));
		});
	}).catch(errors => {
		console.log(errors[0]);
	})
}

function delete_numbering(id) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/delete_numbering`, { id }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(true);
			} else {
				reject(message.errors);
			}
		})
	})
}

function update_numbering(id, data) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/update_numbering`, { id, data }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(true);
			} else {
				reject(message.errors);
			}
		})
	})
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
		} else {
			console.log(message.errors);
		}
	});
}

function get_statistics_uid() {
	axios.post(`${API_URL}/statistics_uid`).then(res => {
		var message = res.data;
		if (message.success) {
			var statistics = message.result;
			$('#daily').text(statistics.daily);
			$('#pdaily').text(Math.round((statistics.daily / 180) * 100) + '% ');
			$('#weekly').text(statistics.weekly);
			$('#pweekly').text(Math.round((statistics.weekly / 900) * 100) + '% ');
			$('#monthly').text(statistics.monthly);
			$('#pmonthly').text(Math.round((statistics.monthly / 3600) * 100) + '% ');
			$('#total').text(statistics.total);
			$('#ptotal').text(Math.round((statistics.total / 6000) * 100) + '% ');
		} else {
			console.log(message.errors);
		}
	});
}

function add_space(space) {
	return new Promise((resolve, reject) => {
		axios.post(`${API_URL}/new_space`, { space }).then(res => {
			var message = res.data;
			if (message.success) {
				resolve(message.result)
			} else {
				reject(message.errors);
			}
		});
	})
}

function add_numbering() {
	const sid = Number($('#cb_section option:selected').text());
	const gid = Number($('#cb_group option:selected').text());
	const l = $('.lbtn-add').ladda();
	l.ladda('start');
	axios.post(`${API_URL}/new_numbering`,
		{
			numbering: {
				section_id: sid,
				group_id: gid,
				number: $('#tb_number').val(),
				numbered: $('#cb_numbered').prop('checked'),
				installed: $('#cb_installed').prop('checked'),
				comment: $('#tb_comment').val(),
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
			} else {
				swal("يوجد خطأ!", message.errors[0].message, "error");
			}
		});
}