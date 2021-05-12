function populateUfs(){
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then( res =>  res.json() )
    .then( states => {
        for(const state of states ){
            ufSelect.innerHTML += `<option value="${state.id}">${state.sigla}</option>`
        }
    } )
}

populateUfs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")
    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    

    citySelect.innerHTML = ""
    citySelect.disabled = true
    

    
    fetch(url)
    .then( res =>  res.json() )
    .then( cities => {
        for(const city of cities ){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )

}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)





    //itens de coleta


    const itensToCollet = document.querySelectorAll(".itens-grid li")

    for(const item of itensToCollet){
        item.addEventListener("click", handleSelectedItem)
    }

    const collectedItens = document.querySelector("input[name=itens]")

    let selectedItens = []


        
    function handleSelectedItem (event){
        const itemLi = event.target
        
        itemLi.classList.toggle("selected")

        const itemId = event.target.dataset.id

        const alredySelected = selectedItens.findIndex( item => {
            const itemFound = item === itemId
            return itemFound
        })

        if(alredySelected > 0){
            const filteredItens = selectedItens.filter( item => {
                const itemIsDifferent = item != itemId
            })

            selectedItens = filteredItens
        } else{
            selectedItens.push(itemId)
        }

        collectedItens.value = selectedItens
    }


