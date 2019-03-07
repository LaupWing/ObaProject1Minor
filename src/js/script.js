import {API} from "../../modules/OBA-wrapper-master/js/index.js"
async function init() {
    const api = new API({
      key: "1e19898c87464e239192c8bfe422f280"
    })
    const stream = await api.createStream("search/book{100}")
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

function cutUndefined(item){
    return item !== undefined
}

function filterArray(item){
    return item.genres[0] !== undefined 
}
function testData(){
    init()
        .then(array=>{
            const cleanData = array.filter(cutUndefined)
            const filtered = cleanData.filter(filterArray)
            localStorage.setItem("bookData", JSON.stringify(filtered))
        })
}
function getGenre(){
    const local = JSON.parse(localStorage.getItem("bookData"))
    const mapped = local.map((x)=>{
        return x.genres
    })
    console.log(mapped)
}   
// getGenre()
// testData()
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
            setBg(bgImage.url,subject)
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
    callback(storage, bgSetting)
}

function checkDay(obj, bgSetting){
    console.log(bgSetting)
    const day = new Date().getDate()
    if(obj.date === day){
        console.log("Tzelfde dag, geen nieuwe bgImg")
        setBg(obj.url, bgSetting.searchterm)
    }else{
        console.log("Niet tzelfde dag, nieuwe bgImg")
        getBg(bgSetting.searchterm, bgSetting.storage)
    }
}

document.querySelector("a")

function setBg(url, searchterm){
    console.log(searchterm)
    const coloring = [
        {
            page: "library",
            color: "rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)"
        },
        {
            page: "Romantic",
            color: "rgba(255, 1, 126, 0.3), rgba(255, 1, 126, 0.3)"
        },
        {
            page: "War",
            color: "rgba(238, 101, 6, 0.3), rgba(238, 101, 6, 0.3)"
        },
        {
            page: "Thriller",
            color: "rgba(179, 27, 26, 0.4), rgba(179, 27, 26, 0.4)"
        },
        {
            page: "Adventure",
            color: "rgba(144, 208, 236, 0.3), rgba(144, 208, 236, 0.3)"
        },
        {
            page: "Humor",
            color: "rgba(253, 255, 118, 0.3), rgba(253, 255, 118, 0.3)"
        },
        {
            page: "Detective",
            color: "rgba(201, 169, 116,0.3), rgba(201, 169, 116,0.3)"
        },

    ]
    const pageGenre = coloring.filter(function(x){
        return searchterm === x.page
    })
    const color = pageGenre[0].color
    console.log(pageGenre)
    document.body.style.background = `linear-gradient(${color}),url(${url})`
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
        <i id="terug" class="fas fa-angle-left"></i>
            <div class="tops">
            </div>
        <i id="volgende" class="fas fa-angle-right"></i>
        </div>
    `
    genresContainer.insertAdjacentHTML( 'beforeend', newElement )
    addImagesTops()
}

function addImagesTops(){
    if(localStorage.getItem("bookData")){
        const data = JSON.parse(localStorage.getItem("bookData"))
        const tops = document.querySelector(".tops")
        console.log(data)
        data.forEach(x=>{
            console.log(x)
            const newElement =
            `
                <div class="img-wrapper"> 
                    <img src="${x.images[0]}"> </img>
                </div>
            `
            tops.insertAdjacentHTML("beforeend", newElement)
        })
        highlight()
        browseClick()
    }else{
        init()
        .then(x=>{
                const tops = document.querySelector(".tops")
                const cleanData = x.filter(cutUndefined)
                console.log(cleanData)
    
                console.log("addingImages")
                const array =[]
                for(let i=0; i<15; i++){
                    console.log("itereren")
                    const newElement =
                    `
                        <div class="img-wrapper"> 
                            <img src="${cleanData[i].images[0]}"> </img>
                        </div>
                    `
                    console.log(newElement)
                    array.push(cleanData[i])
                    tops.insertAdjacentHTML("beforeend", newElement)
                }
                localStorage.setItem("bookData", JSON.stringify(array))
                highlight()
                browseClick()
            })
    }
}

let number = 0;
function highlight(number=0){
    console.log(number)
    const imgwrapper = document.querySelectorAll(".img-wrapper")
    console.log(imgwrapper[number])
    imgwrapper[number].classList.add("highlighted")
}

function removeClass(){
    const imgwrapper = document.querySelectorAll(".img-wrapper")
    imgwrapper.forEach(x=>{
        x.classList.remove("highlighted")
    })
}

function clearContainer(){
    const genres = document.querySelector(".genres")
    console.log(genres)
    while(genres.firstChild){
        genres.removeChild(genres.firstChild)
    }
}
function browseClick(){
    const volgende = document.querySelector("#volgende")
    const terug = document.querySelector("#terug")
    // document.querySelectorAll("i").forEach(i=>{
    //     i.scrollIntoView({
    //         behavior: 'smooth'
    //     })
    // })
    volgende.addEventListener("click", function(){
        document.querySelector(".tops-wrapper").scrollBy(170,0)
        removeClass()
        if(number<14){
            number++
        }
        highlight(number)
    })
    terug.addEventListener("click", function(){
        document.querySelector(".tops-wrapper").scrollBy(-170,0)
        removeClass()
        if(number>0){
            number--
        }
        highlight(number)
    })
}




checkLocalStorage("LandingBG", checkDay, {storage: "LandingBG", searchterm:"library"})