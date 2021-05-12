import React, { useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Select from '../../components/Select'

import warningIcon from '../../assets/images/icons/warning.svg'
import './styles.css'
import { useAuth } from '../../contexts/auth'
import api from '../../services/api'


const TeacherForm = () => {

    const history = useHistory()
    const { user, updateUser } = useAuth()


    const [whatsapp, setWhatsapp] = useState(user?.whatsapp as string)
    const [bio, setBio] = useState(user?.bio as string)

    const [subject, setSubject] = useState('')
    const [cost, setCost] = useState('R$')


    // schedule
    const [invalid, setInvalid] = useState(false)
    const [scheduleItems, setScheduleItems] = useState([{ week_day: 1, from: '07:00', to: '13:00' }])


    const createSchedule = (event: any) => {
        event.preventDefault()
        const newState = [...scheduleItems]
        newState.unshift({ from: '', to: '', week_day: 1 })
        setScheduleItems(newState)
    }

    const deleteSchedule = (index: number) => {
        const newState = scheduleItems.filter((_, idx) => idx !== index)
        setScheduleItems(newState)
    }

    const updateSchedule = (event: any, index: number, field: string) => {
        const newState = [...scheduleItems]
        newState[index] = { ...newState[index], [field]: event.target.value }
        setScheduleItems(newState)
    }



    const handleCreateClass = async (event: FormEvent) => {
        event.preventDefault()

        const name = user?.name as string
        const email = user?.email as string

        const error = await updateUser(email, name, whatsapp, bio)

        if (error) {
            console.log(error)
            setInvalid(true)
        }

        api.post('/classes', {
            email,
            subject,
            cost,
            schedule: scheduleItems
        })
            .then(res => {
                history.push('/success-register')
            })
            .catch(err => {
                console.log(err.response.data.error)
                setInvalid(true)
            })
    }


    return (
        <div id="page-teacher-form" className="container">
            <PageHeader
                actualPage='Dar aulas'
                title="Que incrível que você quer dar aulas."
                description="O primeiro passo é preencher esse formulário de inscrição"
            />

            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <div className='user-info-desktop-65-35'>

                            <div className='user-main-information'>
                                {user?.avatar ?
                                    <img src={user.avatar} alt='user avatar' /> :
                                    <div className='alternative-avatar' />
                                }
                                <div>
                                    <h3>{user?.name}</h3>
                                    <p>{user?.email}</p>
                                </div>
                            </div>

                            <Input
                                label="Whatsapp"
                                name="whatsapp"
                                value={whatsapp}
                                onChange={event => setWhatsapp(event.target.value)}
                            />
                        </div>
                        <Textarea
                            label="Biografia"
                            name="bio"
                            value={bio}
                            onChange={event => setBio(event.target.value)}
                        />
                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>
                        <div className='input-block-60-40-desktop'>
                            <Select
                                label="Matéria"
                                name="subject"
                                value={subject}
                                option="Selecione qual você quer ensinar"
                                onChange={event => setSubject(event.target.value)}
                                options={[
                                    { value: 'Artes', label: 'Artes' },
                                    { value: 'Biologia', label: 'Biologia' },
                                    { value: 'História', label: 'História' },
                                    { value: 'Química', label: 'Química' },
                                    { value: 'Física', label: 'Física' },
                                    { value: 'Matemática', label: 'Matemática' },
                                    { value: 'Inglês', label: 'Inglês' },
                                    { value: 'Português', label: 'Português' }
                                ]}
                            />
                            <Input
                                label='Custo da sua hora por aula'
                                name='cost'
                                value={cost}
                                onChange={event => setCost(event.target.value)}
                            />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                           <button type="button" onClick={createSchedule}>+Novo</button>
                        </legend>

                        {scheduleItems.map((schedule, index) => (
                            <div key={index}>
                                <div className='input-block-55-45-desktop'>
                                    <Select
                                        label="Dia da semana"
                                        name="week_day"
                                        value={schedule.week_day}
                                        onChange={(event) => updateSchedule(event, index, 'week_day')}
                                        options={[
                                            { value: '0', label: 'Domingo' },
                                            { value: '1', label: 'Segunda-Feira' },
                                            { value: '2', label: 'Terça-Feira' },
                                            { value: '3', label: 'Quarta-Feira' },
                                            { value: '4', label: 'Quinta-Feira' },
                                            { value: '5', label: 'Sexta-Feira' },
                                            { value: '6', label: 'Sábado' }
                                        ]}
                                    />
                                    <div className="input-block-50-50-mobile">
                                        <Input
                                            label='Das'
                                            name='from'
                                            value={schedule.from}
                                            onChange={(event) => updateSchedule(event, index, 'from')}
                                        />
                                        <Input
                                            label='Até'
                                            name='to'
                                            value={schedule.to}
                                            onChange={(event) => updateSchedule(event, index, 'to')}
                                        />
                                    </div>
                                </div>
                                <div
                                    className='delete-hour'
                                    onClick={() => deleteSchedule(index)}
                                >
                                    <span>Excluir horário</span>
                                </div>
                            </div>
                        ))}

                        {invalid && (
                            <div className='invalid-information'>
                                <p>Ocorreu um erro salvando as novas informação.</p>
                            </div>
                        )}
                    </fieldset>

                    <footer>
                        <div>
                            <img src={warningIcon} alt="Aviso importante" />
                            <p>
                                <span>Importante!</span> <br />
                                Preencha todos os dados corretamente
                            </p>
                        </div>

                        <button type="submit">Salvar cadastro</button>
                    </footer>
                </form>

            </main>
        </div>
    )
}

export default TeacherForm