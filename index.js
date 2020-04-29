// Did not perform Extra credit 3 as it costed money and it was a promise that we won't be penalized for that 
// Everything else has been done. Thanks!

//event listener function
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// event handler function
async function handleRequest(request) {
  var base_url = fetch('https://cfw-takehome.developers.workers.dev/api/variants')
  let json_data = await base_url.then(result => result.json());
  var ind = Math.round(Math.random())
  let numbers_in_words = ["one", "two"]

  // cookie starts: Extra credit 2

  const cookie = request.headers.get('cookie')

  let NAME = 'revisit'
  let first_url = await json_data["variants"][0]
  let second_url = await json_data["variants"][1]
  let resp; //creating temporary global response
  if (cookie && cookie.includes(`${NAME}=one`)) {
    ind = 0
    resp = await fetch(first_url)
  } else if (cookie && cookie.includes(`${NAME}=two`)) {
    ind = 1
    resp = await fetch(second_url)
  } else {
    var flag = true //flag to check if the user is visiting for the first time
    let group = Math.random() < 0.5 ? 0 : 1 //50/50 split
    ind = group
    resp = group === 0 ? await fetch(first_url): await fetch(second_url) //fetching at random
  }


// cookie ends

// Extra credit 1: Changing copy/URLs 
  const text = await resp.text();
  const window_title_replace = text.replace(
    "<title>Variant "+(ind+1).toString(),
    "<title>Yash Cloudfare Internship - Full Stack Challenge");
  const url_replace = window_title_replace.replace("cloudflare.com", "google.com");
  const url_desc_replace = url_replace.replace("Return to cloudflare.com", "Return to google.com");
  const desc_replace = url_desc_replace.replace("This is variant "+numbers_in_words[ind]+" of the take home project!", "Changed description as well!");
  const final_replace = desc_replace.replace("Variant "+(ind+1).toString(), "Changed title of Variant No."+(ind+1).toString());
  
  
// creating response object
  let response = new Response(final_replace, {
    status: resp.status,
    statusText: resp.statusText,
    headers: resp.headers
  });

// setting cookie to the response header for the fisrt time the user visits a website
// Extra credit 2 completed
  if(flag)
  {
    response.headers.set('Set-Cookie', `${NAME}=${numbers_in_words[ind]}`)
    flag = false
  }
// returning the response
  return response
}

