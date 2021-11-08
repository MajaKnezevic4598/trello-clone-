const addItemBtn = document.querySelectorAll(".add-item");
const saveItemBtn = document.querySelectorAll(".save-item");
const dropConteiners = document.querySelectorAll(".drop-conteiner");

let draggableItem = null;
let draggableItemConteinerNum = null;
let mousePosition = null;
let newArray = [];



let ls = localStorage.getItem("todos");

let arrayOfItems = [];


let initiallArray = [
  { content: "Release the course", location: 1 },
  { content: "Sit back and relax", location: 1 },
  { content: "Work on projects", location: 2 },
  { content: "Listen to music", location: 2 },
  { content: "Being cool", location: 3 },
  { content: "Getting stuff done", location: 3 },
  { content: "Being uncool", location: 4 },
];

if (ls === null) {
  localStorage.setItem("todos", JSON.stringify(initiallArray));
}   

//event listener for styling add button on mause down and mouse up
addItemBtn.forEach(item=>{
    item.addEventListener("mousedown",()=>{
    item.style.backgroundColor = "lightgray";
    item.style.color = "black";
    item.closest(".add-save").querySelector(".save-item").style.display = "flex";
    item.closest(".add-save-conteiner").querySelector('textarea').style.display = "block";
    });
    item.addEventListener("mouseup",()=>{
        item.style.display = "none";
    })
})

saveItemBtn.forEach((item) => {
  item.addEventListener("click", function (e) {
    getData(e);
  });
});

function getData(e){
    const cont = e.target.closest(".add-save-conteiner");
    const text = cont.querySelector('textarea');
    let textValue = text.value;
    let dropConteinerNumber = e.target.closest(".section").querySelector(".drop-conteiner").dataset.location;
    makeItem(textValue,dropConteinerNumber);
    text.value = " ";
    text.style.display = "none";
    cont.querySelector(".add-item").style.display = "flex";
    cont.querySelector(".add-item").style.backgroundColor = "transparent";
    cont.querySelector(".add-item").style.color = "#fffaec";
}



function makeItem(item,location){
    if(item){
        const task = {
            content:item,
            location:location
        }
        arrayOfItems = JSON.parse(localStorage.getItem("todos"));
        arrayOfItems.push(task);
        console.log(arrayOfItems);
        // renderItems(arrayOfItems);
        addToLocalStorage(arrayOfItems)
    } 
        
       
    
}

function renderItems(array){
  
    dropConteiners.forEach(dropConteiner=>{
       dropConteiner.innerHTML = "";

         array.forEach((arr) => {
         
           if(dropConteiner.dataset.location == arr.location){
                  const newDiv = document.createElement("div");
                  newDiv.setAttribute("draggable", "true");
                  newDiv.setAttribute("class","draggable");
                  newDiv.textContent = arr.content;
                  dropConteiner.appendChild(newDiv);
           }
         });

    })
}

function addToLocalStorage(todos){
   
    localStorage.setItem("todos",JSON.stringify(todos));
    renderItems(todos);

}

function getFromLocalStorage(){
     const reference = localStorage.getItem("todos");
     // if reference exists
     if (reference) {
       // converts back to array and store it in todos array
       todos = JSON.parse(reference);
       renderItems(todos);
     }
}

// initially get everything from localStorage
getFromLocalStorage();

/****************dragable and dragging*************************** */

dropConteiners.forEach((item) => {
  item.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) {
      e.target.classList.add("dragging");
      draggableItem = e.target;
      draggableItemConteinerNum = e.target
        .closest(".drop-conteiner")
        .getAttribute("data-location");
    }
  
  });

  item.addEventListener("dragend", function(e){
         e.target.classList.remove("dragging");
  });
});


dropConteiners.forEach(dropCont =>{
    /******************drop event */
    dropCont.addEventListener("drop",dropped);
/**********************drag over event */
     dropCont.addEventListener("dragover", function (e) {
       if (e.target === draggableItem) return;
       let el1;
       e.preventDefault();
       if (e.target.className == "draggable") {
         el1 = e.target;
         position(el1, e);
       } else {
         e.target.appendChild(draggableItem);
       }
     });
   
})

function dropped(e){
    e.preventDefault();
    dropConteiners.forEach(newdrop=>{
        let afterDroppingLocation = newdrop.getAttribute("data-location");
        if(newdrop.hasChildNodes()){
            for(let i=0;i<newdrop.children.length; i++){
                let newText = newdrop.children[i].innerText;
                let newObj = {
                    content:newText,
                    location:afterDroppingLocation,
                }
                newArray.push(newObj);
            }
        }
    })
  
    localStorage.removeItem("todos");
    arrayOfItems = [];
    arrayOfItems=[...newArray]
    addToLocalStorage(arrayOfItems);
    newArray = [];
    draggableItem = null;
    draggableItemConteinerNum = null;
}



function position(element, e) {
  let middle =
    element.getBoundingClientRect().y +
    element.getBoundingClientRect().height / 2;
  let mouseY = e.clientY;
  if (mouseY < middle) {
    element.parentElement.insertBefore(draggableItem, element);
  }
  if (mouseY > middle) {
    element.parentElement.insertBefore(draggableItem, element.nextSibling);
  }
}




