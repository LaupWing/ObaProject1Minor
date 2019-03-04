import {API} from "../../modules/OBA-wrapper-master/js/index.js"


// localStorage.clear();

// const call = (async function(url="search/karin&facet=type(book){100}"){
//     const api = new API({
//         key: "1e19898c87464e239192c8bfe422f280"
//     });
//     // const stream = await api.createStream("search/wouter");
    
//     // stream
//     // .pipe(stringify)
//     // .pipe(console.log)
//     // .catch(console.error);
//     // requests.then(responses => {
//     //     console.log(responses)
//     //   });
    
//     const iterator = await api.createIterator(url);
//     for await (const response of iterator) {
//         console.log(response)
//     }
// })()
// async function init() {
//     const api = new API({
//       key: "1e19898c87464e239192c8bfe422f280"
//     })
//     const stream = await api.createStream("search/banaan")
//     stream
//       .pipe(toJSON)
// }
  
// function toJSON(stream) {
// console.log(stream);
// }
// init()

function getBg(subject = "library"){
    fetch(`https://source.unsplash.com/1600x900?${subject}`)
        .then(response=>{
            const bgImage = {
                url: response.url,
                date: new Date().getDate()
            }
            console.log(bgImage)
            localStorage.setItem("Background", JSON.stringify(bgImage))
            setBg(bgImage.url)
        })
}

function checkLocalStorage(item, callback){
    const storage = JSON.parse(localStorage.getItem(item))
    if(!storage){
        console.log("LocalStorage niet aanwezig")
        getBg()
        return
    }
    console.log("LocalStorage aanwezig")
    callback(storage)
}

function checkDay(obj){
    const day = new Date().getDate()
    if(obj.date === day){
        console.log("Tzelfde dag, geen nieuwe bgImg")
        setBg(obj.url)
    }else{
        console.log("Niet tzelfde dag, nieuwe bgImg")
        getBg()
    }
}

function setBg(url){
    document.body.style.background = `linear-gradient(
                rgba(0, 0, 0, 0.7), 
                rgba(0, 0, 0, 0.7)
              ),url(${url})`
}

const genreContainer = document.querySelectorAll(".container-genre")
genreContainer.forEach(item=>addEvents(item))
function addEvents(item){
    item.addEventListener("mouseover", h1Toggle)
    item.addEventListener("mouseout", h1Toggle)
}


function h1Toggle(){
    document.querySelector("#landing .firstLetter").classList.toggle("hoverh1")
}

checkLocalStorage("Background", checkDay)
















