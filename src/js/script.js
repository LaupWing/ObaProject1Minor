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
async function init() {
    const api = new API({
      key: "1e19898c87464e239192c8bfe422f280"
    })
    const stream = await api.createStream("search/banaan{1000}")
    return  stream
                .pipe(toJSON)
                    .all()
                        .then(allItems)
}
  
function allItems(items){
    const array = items.flat()
    return array
}

function toJSON(stream) {
    return stream
}

function jwzz(){
    // console.log(init())
    const test = init()
    console.log()
    test.then(x=>{
        console.log(x)
        const cleanData = x.filter(cutUndefined)
        // console.log(cleanData)/
        const filteredArray = cleanData.filter(filterArray)
        console.log(filteredArray)
    })
}

function cutUndefined(item){
    return item !== undefined
}

function filterArray(item){
    return item.genres[0] !== undefined 
}

// jwzz()
// console.log(init())

function getBg(subject, storage){
    console.log(subject, storage)
    fetch(`https://source.unsplash.com/1600x900?${subject}`)
        .then(response=>{
            const bgImage = {
                url: response.url,
                date: new Date().getDate()
            }
            console.log(bgImage)
            localStorage.setItem(storage, JSON.stringify(bgImage))
            setBg(bgImage.url)
        })
}

function checkLocalStorage(item, callback, bgSetting){
    const storage = JSON.parse(localStorage.getItem(item))
    if(!storage){
        console.log("LocalStorage niet aanwezig")
        getBg(bgSetting.searchterm, bgSetting.storage)
        return
    }
    console.log("LocalStorage aanwezig")
    callback(storage)
}

function checkDay(obj, bgSetting){
    console.log()
    const day = new Date().getDate()
    if(obj.date === day){
        console.log("Tzelfde dag, geen nieuwe bgImg")
        setBg(obj.url)
    }else{
        console.log("Niet tzelfde dag, nieuwe bgImg")
        getBg(bgSetting.searchterm, bgSetting.storage)
    }
}

document.querySelector("a")

function setBg(url){
    document.body.style.background = `linear-gradient(
                rgba(0, 0, 0, 0.7), 
                rgba(0, 0, 0, 0.7)
              ),url(${url})`
}

const genreContainer = document.querySelectorAll(".container-genre")
genreContainer.forEach(item=>addEvents(item))
function addEvents(item){
    item.addEventListener("mouseover", classToggle)
    item.addEventListener("mouseout", classToggle)
    item.addEventListener("click", handleclick)
}

function handleclick(){
    const genre = this.querySelector("svg").classList.value
    console.log(genre)
    checkLocalStorage(`${genre}BG`, checkDay, {storage:`${genre}BG`, searchterm:`${genre}`})
}

function classToggle(){
    this.classList.toggle(this.querySelector("svg").id)
    this.querySelectorAll("svg path").forEach(path=>{
        path.classList.toggle("anim")
    })
    if(this.querySelector("ellipse")){
        this.querySelector("ellipse").classList.toggle("anim")
    }
}

window.addEventListener("hashchange", renderGenre)

function renderGenre(){
    clearContainer()
    const genre = window.location.hash.slice(1)
    const firstLetter = genre.slice(0,1)
    const restGenre = genre.slice(1)
    const genresContainer = document.querySelector(".genres")
    genresContainer.classList.add("genrePage")
    document.querySelector(".container").classList.add("genrePage")
    document.querySelector("h1").innerHTML = `
        <span>${firstLetter}</span>${restGenre}
    `
    const newElement = 
    `
        <select name="" id="datum">
            <option value="">Deze Week</option>
            <option value="">Deze Maand</option>
            <option value="">Dit Jaar</option>
        </select>
        <div class="tops-wrapper">
        <i class="fas fa-angle-left"></i>
            <div class="tops">
            </div>
        <i class="fas fa-angle-right"></i>
        </div>
    `
    genresContainer.insertAdjacentHTML( 'beforeend', newElement )
    addImagesTops()
}

function addImagesTops(){
    init()
    .then(x=>{
            const tops = document.querySelector(".tops")
            console.log("addingImages")
            const cleanData = x.filter(cutUndefined)
            console.log(cleanData)
            for(let i=20; i<30; i++){
                console.log("itereren")
                const newElement =
                `
                    <div class="img-wrapper"> 
                        <img src="${cleanData[i].images[0]}"> </img>
                    </div>
                `
                console.log(newElement)
                tops.insertAdjacentHTML("beforeend", newElement)
            }
            highlight()
        })
}

function highlight(){
    const imgwrapper = document.querySelectorAll(".img-wrapper")
    imgwrapper[0].classList.add("highlighted")
}

function clearContainer(){
    const genres = document.querySelector(".genres")
    console.log(genres)
    while(genres.firstChild){
        genres.removeChild(genres.firstChild)
    }
}



checkLocalStorage("LandingBG", checkDay, {storage: "LandingBG", searchterm:"library"})