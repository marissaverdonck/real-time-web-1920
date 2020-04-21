//https://www.strava.com/settings/api
//https://www.strava.com/oauth/authorize?client_id=45991&redirect_uri=http://localhost&response_type=code&scope=activity:read_all
//http://localhost/?state=&code=3d1dadb3d9a356ed0c3a9531fc5cbebbf0f8dfe5&scope=read,activity:read_all

//https://www.strava.com/api/v3/athlete/activities?access_token=6780380be4af0d36d066badfd23c12e99d941b64

const auth_link = "https://www.strava.com/oauth/token"
var users = [{
  token_type: "Bearer",
  expires_at: 1586910452,
  expires_in: 20494,
  refresh_token: "965f1e21cb5d7d1cea8aa1bdfd64a1645cf74902",
  access_token: "90fabcd0c00dc33eef6f0b17a9a14f7d0424b478",
  athlete: {
    id: 4322957,
    username: "mkcnodrev",
    resource_state: 2,
    firstname: "Marissa",
    lastname: "Kcnodrev",
    city: "Heemskerk",
    state: "NH",
    country: "The Netherlands",
    sex: "F",
    premium: false,
    summit: false,
    created_at: "2014-03-31T16:30:40Z",
    updated_at: "2020-04-14T10:12:52Z",
    badge_type_id: 0,
    profile_medium: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/4322957/1380046/8/medium.jpg",
    profile: "https://dgalywyr863hv.cloudfront.net/pictures/athletes/4322957/1380046/8/large.jpg",
    friend: null,
    follower: null
  }
}]



function getActivites() {
  const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${users[0].access_token}`
  fetch(activities_link)
    .then((result) => console.log(result.json()))
}


function reAuthorize() {
  // fetch(auth_link, {
  //     method: 'post',
  //     headers: {
  //       'Accept': 'application/json, text/plain, */*',
  //       'Content-Type': 'application/json'
  //     },

  //     body: JSON.stringify({

  //       client_id: '45991',
  //       client_secret: '6f1438b06056bced8e097dc0dfe8b32d68258686',
  //       refresh_token: '681bef096ee5b0de26320f6b1e4db1cda5059ca9',
  //       grant_type: 'refresh_token'
  //     })
  //   })
  //   // .then(res => getActivites(res))
  //   // .then(res => res.json())
  //   // .then(res => getActivites(res))
  //   .then((res) => console.log(res.json()))
  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("https://www.strava.com/oauth/token?client_id=45991&client_secret=6f1438b06056bced8e097dc0dfe8b32d68258686&code=bd63efbb0d0556ce6d868fbca4952e9241e24649&grant_type=authorization_code", requestOptions)

  .then(response => response.json())
    .then(result => saveUser(result))
    .catch(error => console.log('error', error));
}

function saveUser(result) {
  users.push(result)
  console.log(users)
}

reAuthorize()
  // getActivites()