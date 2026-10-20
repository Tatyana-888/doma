const button = document.querySelector("#hello-button");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent = "Спасибо! Вы только что запустили первую функцию сайта ✨";
});
