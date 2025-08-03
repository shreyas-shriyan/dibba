import { GreetService } from "./bindings/github.com/shreyas-shriyan/dibba";
import { Events } from "@wailsio/runtime";

const resultElement = document.getElementById("result");
const timeElement = document.getElementById("time");

window.doGreet = () => {
  let name = document.getElementById("name").value;
  if (!name) {
    name = "anonymous";
  }
  GreetService.Greet(name)
    .then((result) => {
      resultElement.innerText = result;
    })
    .catch((err) => {
      console.log(err);
    });
};

Events.On("time", (time) => {
  timeElement.innerText = time.data;
});
