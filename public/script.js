let lists;
let myInput = document.getElementById("myInput");
myInput.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    if (myInput.value.trim() != "") {
      let titleValue = myInput.value.trim();
      let task = {};
      task.id = Date.now();
      task.name = titleValue;
      task.status = "";
      /**
       * Send data using fetch
       */
      let res = sendDataToServer(task);
      if (res != undefined) createNode(task);
    }
    // after enter input fild should be empty
    myInput.value = "";
  }
});

async function sendDataToServer(text) {
  let option = {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(text),
  };
  const response = await fetch("http://localhost:3000/sendData", option)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log("data", data);
      console.log("data send successfully");
      return data;
    })
    .catch((e) => {
      console.log(`Internal server error for ${e}`);
    });
  // console.log("response text -> ", response);
  return response;
}

/// create new node ;
function createNode(object) {
  let myTodoList = document.getElementById("myTodoList");
  let titleValue = object.name;
  let status = object.status;
  //create new node
  let node = document.createElement("LI");
  node.setAttribute("id", object.id);
  node.setAttribute("class", status);
  let check = document.createElement("input");
  check.setAttribute("type", "checkbox");
  let title = document.createElement("span");
  //lists.push(titleValue); // add list in lists array
  title.innerHTML = titleValue;
  let icon = document.createElement("i");
  icon.setAttribute("class", "fa fa-remove");
  //node.appendChild(check);
  node.appendChild(title);
  node.appendChild(icon);
  myTodoList.appendChild(node);
  //remove current child node
  // let delEle;
  icon.addEventListener("click", removeChildNode);

  async function removeChildNode(ev) {
    let parent = ev.target.parentNode;
    let id = parent.getAttribute("id");
    let textId = {};
    textId.id = id;
    let option = {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(textId),
    };
    const response = await fetch("http://localhost:3000/deleteList", option)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((e) => {
        console.error(`Internal server error for ${e}`);
      });
    if (response.message == "delete successful") {
      delEle = title.textContent;
      let grandParent = parent.parentNode;
      grandParent.removeChild(parent);
    }
  }
  // travarse the the lilsts array and find the position

  //completed work
  check.addEventListener("click", function (isChecked) {
    let parent = isChecked.target;
    if (parent.checked) {
      title.style.textDecoration = "line-through";
    } else {
      title.style.textDecoration = "none";
    }
  });

  title.addEventListener("click", function (get) {
    if (check.checked == false) {
      title.style.textDecoration = "line-through";
      check.checked = "true";
    }
    if (check.checked == true) {
      title.style.textDecoration = "none";
      check.checked = "false";
    }
  });
}

var list = document.querySelector("ul");
list.addEventListener(
  "click",
  function (event) {
    if (event.target.tagName === "LI") {
      const id = event.target.id;
      changeStatus(id);
      console.log(id);
      event.target.classList.toggle("checked");
    }
  },
  false
);

async function changeStatus(id) {
  const textId = {};
  textId.id = id;
  let option = {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(textId),
  };
  console.log(option);
  const response = await fetch("http://localhost:3000/changeStatus", option)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.error(`Integernal server error ${e}`);
    });
  if (response.message == "status changed") {
    console.log(response);
  }
}
async function fetchDataFromServer() {
  await fetch("http://localhost:3000/getList")
    .then((response) => response.json())
    .then((data) => {
      lists = data;
    })
    .catch((err) => {
      throw err;
    });

  lists.forEach((list) => {
    createNode(list);
  });
}
fetchDataFromServer();
