const addItemBtn = document.querySelectorAll(".add-item");
const saveItemBtn = document.querySelectorAll(".save-item");
const dropConteiners = document.querySelectorAll(".drop-conteiner");

let draggableItem = null;
let draggableItemConteinerNum = null;
let mousePosition = null;
let newArray = [];



let ls = localStorage.getItem("todos");
//ovde treba da gledamo ako je todos iz local storage null ako ne postiji
//onda je array of items prazan ako nije prazan onda dohvatimo podatke iz lokal storage i pravimo niz od njega

let arrayOfItems = [];

// arrayOfItems = ls ? JSON.parse(localStorage.getItem("todo")): [
//           { content: "Release the course", location: 1 },
//           { content: "Sit back and relax", location: 1 },
//           { content: "Work on projects", location: 2 },
//           { content: "Listen to music", location: 2 },
//           { content: "Being cool", location: 3 },
//           { content: "Getting stuff done", location: 3 },
//           { content: "Being uncool", location: 4 }
//         ];

 

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


//ovde moramo da dodamo local storage-u 
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
  
    //prvo moramo da ocistimo sav prethodni sadrzaj u conteinerima
    dropConteiners.forEach(dropConteiner=>{
       dropConteiner.innerHTML = "";
      
       //ovde sada treba da pretrazujemo location i da smestamo odgovarajuci elemente u
       //kontejnere sa odgavarajucim lokacijama

         array.forEach((arr) => {
         
           if(dropConteiner.dataset.location == arr.location){
                  const newDiv = document.createElement("div");
                  newDiv.setAttribute("draggable", "true");
                  newDiv.setAttribute("class","draggable");
                  //setting items to be draggable
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
         console.log("dragEnd");
         e.target.classList.remove("dragging");
         //na drugom mestu stavljamo null za dragableItem i dragableConteinerNum
         //stavili smo u funkciju drag
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
    //ovde moramo da updejtujemo niz da pokupimo sve i da ponovo 
    //pusujemo u local storage
    dropConteiners.forEach(newdrop=>{
       
        console.log(newdrop)
        let afterDroppingLocation = newdrop.getAttribute("data-location");
        if(newdrop.hasChildNodes()){
            console.log(newdrop.children)
            // for(let i=0)
            for(let i=0;i<newdrop.children.length; i++){
                console.log(newdrop.children[i].innerText);
                let newText = newdrop.children[i].innerText;
                let newObj = {
                    content:newText,
                    location:afterDroppingLocation,
                }

                newArray.push(newObj);
              
               
            }
         
            
             //ovde praznimo glavni niz;
             //dodajemo inicijalni niz koji se ispijuje
            //  arrayOfItems.push(initiallArray);
            //  arrayOfItems.push(newArray);
            //  console.log(newArray);
            //  localStorage.removeItem("todos");
            //  //ovde ce se mozda duplirati
            //  addToLocalStorage(arrayOfItems);
        }
        //    console.log(newArray);
        //    addToLocalStorage(...newArray)
       
    })
    console.log(newArray);
    localStorage.removeItem("todos");
    arrayOfItems = [];
    arrayOfItems=[...newArray]
    // localStorage.setItem("todos",newArray);
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




