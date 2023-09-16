import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";

{/* <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script> */}

var jQueryScript = document.createElement('script');  
jQueryScript.setAttribute('src','https://code.jquery.com/jquery-3.7.1.min.js');
jQueryScript.setAttribute('integrity', 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=');
jQueryScript.setAttribute('crossorigin', 'anonymous')
document.head.appendChild(jQueryScript);

// Init VK Mini App
bridge.send("VKWebAppInit");

// get VK API token
bridge.send('VKWebAppGetAuthToken', { 
  app_id: 51747238, 
  scope: 'groups,stats,wall'
  })
  .then((data) => { 
    if (data.access_token) {
      // Ключ доступа пользователя получен
      window.access_token = data.access_token;
      console.log('VK TOKEN: ' + window.access_token);
    }
  })
  .catch((error) => {
    // Ошибка
    console.log(error);
  });

ReactDOM.render(<App />, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
