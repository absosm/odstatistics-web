// const API_URL = 'http://127.0.0.1:5001';
const API_URL = 'https://statistics-api.apcouleddjellal.dz';
const auth = firebase.auth();

function slice_hash(hash_url) {
  var bl = hash_url.slice(1).split('&');
  var hash = null;
  if(bl.length >= 1) {
    hash = {};
    for(var i = 0; i < bl.length; i += 1) {
      const key = bl[i].split('=')[0];
      const val = bl[i].split('=')[1];
      if (val === undefined)
        continue;
      hash[key]=val;
    }
  }
  return hash;
}