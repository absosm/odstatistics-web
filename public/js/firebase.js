// const API_URL = 'http://localhost:5000';
// const API_URL = 'https://apcouleddjellal-main.herokuapp.com';
const auth = firebase.auth();
// Initialize Firebase
var database = firebase.database();

function slice_hash(hash_url) {
  var bl = hash_url.slice(1).split('?');
  var hash = {};
  if(bl.length >= 1) {
    for(var i = 0; i < bl.length; i += 1) {
      hash[bl[i].split('=')[0]]=bl[i].split('=')[1];
    }
  }
  return hash;
}