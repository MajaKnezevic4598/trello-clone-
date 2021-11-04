console.log("hello")
const addItemBtn = document.querySelectorAll(".add-item");
const saveItemBtn = document.querySelectorAll(".save-item");
// u drop conteiner cemo da stavljamo taskove
const dropConteiners = document.querySelectorAll(".drop-conteiner");
console.log(dropConteiners);
 

let arrayOfItems = [];
//u ovaj niz ubacujemo objekte itema;



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

saveItemBtn.forEach((item)=>{
    item.addEventListener("click", function(e){
        saveItem(e)
    })
})

function saveItem(e){
   
    const cont = e.target.closest(".add-save-conteiner");
    const text = cont.querySelector('textarea');
    let textValue = text.value;
    console.log(textValue);
    let dropConteinerNumber = e.target.closest(".section").querySelector(".drop-conteiner").dataset.location;
    console.log(dropConteinerNumber);
    makeItem(textValue,dropConteinerNumber);
    text.value = " ";
    console.log("posle se ponovo vracam u ovu funkciju")
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

        arrayOfItems.push(task);
        console.log(arrayOfItems);
        // renderItems(arrayOfItems);
        addToLocalStorage(arrayOfItems)
        //renderItems ce rendirati na DOM sadrzaj niza
       
        //cisti input polje
        //vrati style na prethodni 
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
                  //setting items to be draggable
                  newDiv.textContent = arr.content;
                  dropConteiner.appendChild(newDiv);
           }
         });

    })
   
    

}

//function that adds tasks to localStorage and than renders it

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

//ovde dohvatamo dinamicke elemente koji pre toga nisu postojali
 const draggableElements = document.querySelectorAll("[draggable='true']");
 console.log(draggableElements);

 //dodajemo dragStart event

 draggableElements.forEach(item=>{
     item.addEventListener("dragstart",dragStart);
     item.addEventListener("dragend",dragEnd)
 })

 function dragStart(){
     console.log('drag start')
 }

 function dragEnd(){
     console.log('dragEnd')
 }