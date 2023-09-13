import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";

// Init VK Mini App
bridge.send("VKWebAppInit");

// get VK API token
bridge.send('VKWebAppGetAuthToken', { 
  app_id: 51747238, 
  scope: 'groups,stats'
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
