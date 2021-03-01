window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      if (snake.currentDirection !== "Left") {
        snake.currentDirection = "Right";
        snake.setDirection(scale, 0);
      }
      break;
    case "ArrowLeft":
      if (snake.currentDirection !== "Right") {
        snake.currentDirection = "Left";
        snake.setDirection(-scale, 0);
      }
      break;
    case "ArrowDown":
      if (snake.currentDirection !== "Up") {
        snake.currentDirection = "Down";
        snake.setDirection(0, scale);
      }
      break;
    case "ArrowUp":
      if (snake.currentDirection !== "Down") {
        snake.currentDirection = "Up";
        snake.setDirection(0, -scale);
      }
      break;
  }
});

window.document.getElementById("start").onclick = function () {
  setUp();
};

function signout() {
  const request = new XMLHttpRequest();

  request.open("DELETE", "users/signout", true);
  request.onload = (event) => {
    if (request.status === 200) {
      window.location.assign("/users/login");
    }
  };
  request.send();
}

function relocateLogin() {
  location.href = "http://localhost:3000/users/login";
}
