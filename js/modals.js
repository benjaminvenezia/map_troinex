/* ------------------------------------------------   MAP   ------------------------------------------------ */
let lieux_interet_liste;
let ecopoints_liste;

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchLieuxInterets() {
    lieux_interet_liste = await fetchData("./data/lieux_interet.json");
}

async function fetchEcopoints() {
    ecopoints_liste = await fetchData("./data/ecopoints.json");
}

const lieux_interet = document.querySelector("#LIEUX_INTERET").children;
const ecopoints = document.querySelector("#ECOPOINTS").children;

const modal_lieu_interet = document.querySelector(".lieu_interet_modal");
const modal_ecopoint = document.querySelector(".ecopoint_modal");

function moveModalToCursor(event, modal) {
    const modalPointer = document.querySelector(".modal_pointer");
    const modalEcopointPointer = document.querySelector(".ecopoint_modal_pointer");

    modalPointer.classList.remove("modal_pointer--reversed");
    modalEcopointPointer.classList.remove("ecopoint_modal_pointer--reversed");

    const posX = event.clientX;
    const posY = event.clientY;

    modal.style.left = `${posX + 40}px`;
    modal.style.top = `${posY - modal.offsetHeight / 2}px`;

    const isModalLieuInteretOut = isModalGoingOutOfScreen(modal_lieu_interet);
    const isModalEcopointOut = isModalGoingOutOfScreen(modal_ecopoint);

    if (isModalLieuInteretOut) {
        modalPointer.classList.add("modal_pointer--reversed");
        modal.style.left = `${posX - 400}px`;
    }

    if (isModalEcopointOut) {
        modalEcopointPointer.classList.add("ecopoint_modal_pointer--reversed");
        modal.style.left = `${posX - 400}px`;
    }
}

function isModalGoingOutOfScreen(modal) {
    const { x, y, width, height } = modal.getBoundingClientRect();
    const modalEnd = x + width;
    const windowEnd = window.innerWidth;

    if (modalEnd > windowEnd) {
        return true;
    }

    return false;
}

function addEventOnEcopoints() {
    for (let ecopoint of ecopoints) {
        ecopoint.addEventListener("click", (event) => {

            hideModales();
            cleanActiveSvg();

            const rects = ecopoint.getElementsByTagName("rect");

            for (rect of rects) {
                rect.classList.add("active-ecopoint");
            }

            const { id, titre, desc, icons } = ecopoints_liste.find((item) => item.id === ecopoint.id); // /!\ L'id doit être le même entre l'import SVG et la liste .json. (ex: ecopoint15)
            modal_ecopoint.classList.remove("hide");
            const modal_titre = modal_ecopoint.querySelector(".ecopoint_titre");
            const modal_desc = modal_ecopoint.querySelector(".ecopoint_description");
            const modal_icons = modal_ecopoint.querySelector(".ecopoint_icons");

            modal_titre.textContent = titre;
            modal_desc.textContent = desc;
            modal_icons.innerHTML = icons
                .map((icon) => `<img class="ecopoint_icon" src="./assets/icons/ecopoints/${icon}" alt="${icon.split(".")[0]}">`)
                .join("");

            moveModalToCursor(event, modal_ecopoint);
        });
    }
}

function addEventOnLieuxInteret() {
    for (let lieu of lieux_interet) {
        lieu.addEventListener("click", (event) => {
            hideModales();
            cleanActiveSvg();

            const circles = lieu.getElementsByTagName("circle");

            for (let circle of circles) {
                circle.classList.add("active");
            }

            const { titre, desc, image, url } = lieux_interet_liste.find((item) => item.id === lieu.id);
            
            modal_lieu_interet.classList.remove("hide");
            const modal_titre = modal_lieu_interet.querySelector(".lieu_interet_titre");
            const modal_desc = modal_lieu_interet.querySelector(".lieu_interet_description");
            const modal_image = modal_lieu_interet.querySelector(".lieu_interet_image");
            const modal_url = modal_lieu_interet.querySelector(".lieu_interet_url");

            modal_titre.textContent = titre;
            modal_desc.textContent = desc;
            modal_image.src = `./assets/images/lieux_interet/${image}`;
            modal_url.href = url;

            moveModalToCursor(event, modal_lieu_interet);
        });
    }
}


function closeModale() {
    const lieu_interet_icon = document.getElementById("lieu_interet_modal_close_icon");
    lieu_interet_icon.addEventListener("click", () => {
        modal_lieu_interet.classList.add("hide");
        cleanActiveSvg();
    });
}

function closeEcopointModale() {
    const ecopoint_icon = document.getElementById("ecopoint_modal_close_icon");
    ecopoint_icon.addEventListener("click", () => {
        modal_ecopoint.classList.add("hide");
        cleanActiveSvg();
    });
}

function hideModales() {
    cleanActiveSvg();
    const modal_lieu_interet = document.querySelector(".lieu_interet_modal");
    const modal_ecopoint = document.querySelector(".ecopoint_modal");
    //put all modales you need to hide
    modal_lieu_interet.classList.add("hide");
    modal_ecopoint.classList.add("hide");
}

function cleanActiveSvg() {
    const allCircles = document.getElementsByTagName("circle");
    const allRects = document.getElementsByTagName("rect");

    for (let circle of allCircles) {
        circle.classList.remove("active");
    }

    for (let rect of allRects) {
        rect.classList.remove("active-ecopoint");
    }
 
 
}


fetchLieuxInterets();
fetchEcopoints();
addEventOnLieuxInteret();
addEventOnEcopoints();
closeModale();
closeEcopointModale();


/* ------------------------------------------------   Panel  ------------------------------------------------ */

function cleanPanelLocation() {
    const allLieuxInterets = document.querySelectorAll("#LIEUX_INTERET")

    for (let el of allLieuxInterets) {
        const allLocations = el.children;
        for(item of allLocations) {
            item.classList.remove("panel-subitem-location--svg")
        }
    }
}

function addEventOnPanelItems() {
    const panelItems = document.querySelectorAll('.panel-item');
    
    panelItems.forEach((panelItem) => {
        panelItem.addEventListener("click", () => {
           panelItem.classList.toggle('panel-item--inactive')
    
           if(panelItem.classList.contains('panel-item-locations')){
            const listOfLocations = document.getElementById('panel-item-locations');
            listOfLocations.classList.toggle('hide');
            const iconMore = panelItem.querySelector('.panel-icon-more');
            iconMore.classList.toggle('panel-icon-more--active')
           }
    
           const iconEyeClose = panelItem.querySelector('.panel-icon-eye-close');
           const iconEyeOpen = panelItem.querySelector('.panel-icon-eye-open');
           iconEyeClose.classList.toggle('hide');
           iconEyeOpen.classList.toggle('hide');
        } )
    })
}

function addEventsOnLocation() {
    const locationItems = document.querySelectorAll('.panel-subitem-location');

    locationItems.forEach((locationItem) => {
        locationItem.addEventListener("mouseover", () => {
            cleanPanelLocation();
            const id = locationItem.dataset.locaid;
            // const location = lieux_interet_liste.find(el => el.id === id);
            const svgLocation = document.getElementById(id);
            svgLocation.classList.add('panel-subitem-location--svg');

        })
    })
}
const buttonTransports = document.getElementById("btn-transports");
const buttonLocations = document.getElementById("btn-locations");
const buttonEcopoints = document.getElementById("btn-ecopoints");

toggleMapIcons(buttonTransports, "TRANSPORTS");
toggleMapIcons(buttonLocations, "LIEUX_INTERET");
toggleMapIcons(buttonEcopoints, "ECOPOINTS");

function toggleMapIcons(buttonDom, listIconsName) {
    const icons = document.querySelectorAll(`#${listIconsName}`);

    buttonDom.addEventListener("click", () => {
        icons.forEach((busIcon) => {
            for (const el of busIcon.children) {
                el.classList.toggle('hide');
            }
        })
    })
}

function hideByDefaultMapIcons(listIconsName) {
    const icons = document.querySelectorAll(`#${listIconsName}`);
    icons.forEach((busIcon) => {
        for (const el of busIcon.children) {
            el.classList.add('hide');
        }
    })
}

hideByDefaultMapIcons("TRANSPORTS");


function cleanLocationItemsWhenMouseIsLeaving() {
    const subpanel = document.getElementById('panel-item-locations');
    subpanel.addEventListener("mouseleave", () => {
        cleanPanelLocation();
    })
}


addEventOnPanelItems()
addEventsOnLocation()
cleanLocationItemsWhenMouseIsLeaving();


/* ------------------------------------------------   MAP HELPER  ------------------------------------------------ */
//A n'activer que pour mettre en évidence les éléments avec la propriété des fichiers json "show" à true

fetchAndShowIcons();

async function fetchIconsSettedToTrue() {
    const ecopointsFocused = await ecopoints_liste.filter((ecopoint) => ecopoint.show === true);
    const lieuxInteretFocused = await lieux_interet_liste.filter((lieuInteret) => lieuInteret.show === true);

    const all = ecopointsFocused.concat(lieuxInteretFocused);
    const ids = all.map((el) => el.id);

    for (const ecopointNode of ecopoints) {
        if (ids.includes(ecopointNode.id)) {
            ecopointNode.classList.add("helper-focus");
        }
    }

    for (const lieuInteretNode of lieux_interet) {
        if (ids.includes(lieuInteretNode.id)) {
            lieuInteretNode.classList.add("helper-focus");
        }
    }

    return all;
}
async function fetchAndShowIcons() {
    await Promise.all([fetchLieuxInterets(), fetchEcopoints()]).then(() => {
        fetchIconsSettedToTrue();
    });
}
