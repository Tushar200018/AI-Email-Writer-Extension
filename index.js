var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization",config.API_KEY);

var body = {
    model: "text-davinci-003",
    prompt: "Write an Email based on the following questions and answers./n",
    temperature: 0.7,
    max_tokens: 1024
  }

var raw = JSON.stringify(body);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

const fetchMail = async ()=>{
    const loading = document.querySelector(".loading");
    const appContainer=document.querySelector("#appContainer");
    console.log(loading);
    console.log(appContainer);
    try{
        loading.style.display="flex";
        appContainer.style.display="none";
        const res = await fetch("https://api.openai.com/v1/completions",requestOptions);
        const data = await res.json();
        const mailBody = data.choices[0].text;
        messageBody = encodeURIComponent(mailBody);
        const composeUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&body=${messageBody}`;
        chrome.tabs.query({ url: 'https://mail.google.com/*' }, tabs => {
        if (tabs.length > 0) {
            // If the Gmail tab is already open, update the URL to open the compose section with the pre-filled body
            const tabId = tabs[0].id;
            chrome.tabs.update(tabId, { url: composeUrl,active: true});
        } else {
            // If the Gmail tab is not open, create a new tab with the compose URL
            chrome.tabs.create({ url: composeUrl });
        }
        });
        loading.style.display="none";
        appContainer.style.display="block";
    }
    catch(e){
        console.log("Error in generating the mail",e);
        loading.style.display="none";
        appContainer.style.display="block";
    }
}

const questions = {
    "audience": "Who is the audience for this email ?",
    "purpose": "What is the purpose of the email ?",
    "tone": "What tone should be used in the email ?",
    "specifics": "What information should be included in the email ?",
}

const onSubmit = (e)=>{
    e.preventDefault();
    Object.keys(questions).forEach(category=>{
        const field = document.getElementById(category);
        if(field.value!==""){
            body.prompt = body.prompt + questions[category] + "/n" + "Answer - " + field.value + "/n";
        }
    })
    raw = JSON.stringify(body);
    requestOptions.body=raw;
    console.log(requestOptions);
    fetchMail();
}

const form = document.getElementById("mailDetails");

form.addEventListener("submit",onSubmit);



