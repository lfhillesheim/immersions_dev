import React, { useEffect, useState, ChangeEvent, FormEvent} from 'react'
import { Link } from 'react-router-dom'
import { FiArrowDownLeft} from 'react-icons/fi'
import { Map, TileLayer, Marker} from 'react-leaflet'
import './style.css'
import logo from '../../assets/logo.svg'
import api from '../../services/api'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../components/dropzone/index'




interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFresponse {
    sigla: string;
}


interface IBGEcityResponse {
    nome: string;
}



const CreatePoint = () =>{

    const [itens, setItens] = useState<Item[]>([]);

    const [selectedPosition, setSelectionPosition] = useState<[number, number]>([0, 0]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [city, setCity] = useState<string[]>([]);
    
    
    const [selectedUF, setSelectedUf] = useState ('0');
    const [Selectedcity, setSelectCity] = useState('0');

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedItem, setSelectedItem] = useState<number[]>([])

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        whatsApp: '',
    })

    const [selectedFile, setSelectedFile] = useState<File>()

    useEffect(() => {
       
       
        navigator.geolocation.getCurrentPosition(position =>{
            const { latitude , longitude } = position.coords;
            
         
        //    const latitude = -26.8560346
        //    const longitude = -49.2391869
            setInitialPosition([latitude, longitude]);
        })
    })


    useEffect(() => {
        api.get('itens').then(response => {
            setItens(response.data);
            
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);


            setUfs(ufInitials)
        })
    })


    useEffect(() =>{
        if (selectedUF === '0'){
            return;
        } 
            axios
            .get<IBGEcityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
    
    
                setCity(cityNames);
            });
        

    }, [selectedUF]);


    async function handleSelectedUf (event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setSelectedUf(uf);
    }



     function handleSelectedCity (event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setSelectCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectionPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function HandleInputsChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
       
        setFormData({ ...formData, [name]: value })
    }


    function handleSelectIten(id: number){
        const alredySelected = selectedItem.findIndex(item => item === id);
        if (alredySelected >= 0){
            const filteredItens = selectedItem.filter(item => item !== id)
            setSelectedItem(filteredItens)
        }else{
            
            setSelectedItem([...selectedItem, id])
        }
    }

async function handleSubmit(event: FormEvent){
   
    
    
    event.preventDefault();
    const { name , email , whatsApp } = formData;
    const uf = selectedUF;
    const city = Selectedcity;
    const [latitude, longitude] = selectedPosition;
    const itens = selectedItem;

    const data = new FormData();
         data.append('name', name);
         data.append('email', email);
         data.append('whatsApp', whatsApp);
         data.append('uf', uf);
         data.append('city', city);
         data.append('latitude', String(latitude));
         data.append('longitude', String(longitude));
         data.append('itens', itens.join(','));


         if (selectedFile){ 
             
             data.append('image', selectedFile);
        }
      

    await api.post('points' , data)

    alert('deu')

    

    
}


    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/"> 
                <FiArrowDownLeft />
                Voltar Para Home</Link>
                
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de Coleta</h1>  
                
                <Dropzone onFileUploaded={setSelectedFile} />
                
                
                <fieldset>
                    <legend>
                        <h2>Dados</h2>

                    </legend>
                    
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input 
                        type="text"
                        name="name"
                        id="name"
                        onChange={HandleInputsChange}
                        />
                    </div>

                    <div className="field-group">

                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input 
                        type="email"
                        name="email"
                        id="email"
                        onChange={HandleInputsChange}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="whatsApp">WhatsApp</label>
                        <input 
                        type="text"
                        name="whatsApp"
                        id="whatsApp"
                        onChange={HandleInputsChange}
                        />
                    </div>
                </div>
                        

                </fieldset>  

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione o Endereço no Mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                         />

                        <Marker position={selectedPosition}> 

                        </Marker>

                    </Map>


                    <div className="field-group">

                        <div className="field">

                            <label htmlFor="">Estado (UF)</label>

                            <select name="uf" id="uf" value={selectedUF} onChange={handleSelectedUf}>
                                <option value="0">Selecione o Estado</option>
                                    {ufs.map(uf => (
                                        <option key={uf}  value={uf}>{uf}</option>
                                    ))}
                            </select>
                        </div>


                    
                 
                        <div className="field">

                            <label htmlFor="">Cidade</label>
                            <select name="city" id="city" value={Selectedcity} onChange={handleSelectedCity}>
                                <option value="0">Selecione a Cidade</option>
                                {city.map(city => (
                                        <option key={city}  value={city}>{city}</option>
                                    ))}
                            </select>
                        </div>

                    </div>
                   
                </fieldset> 

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Seleciona um ou mais itens abaixo</span>
                    </legend>

                        <ul className="items-grid">
                            {itens.map(item => (
                            <li key={item.id} onClick={() => handleSelectIten(item.id)}
                            className={selectedItem.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>))}
                            

                            
                        </ul>
                    
                </fieldset> 
                
                <button type="submit">
                    Cadastrar Ponto de Coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint