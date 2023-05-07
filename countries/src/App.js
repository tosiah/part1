import {useEffect, useState} from 'react'
import countriesService from './services/countries'

const Search = ({searchPhrase, onChangeHandler}) => {
    return <div>find country: <input value={searchPhrase} onChange={onChangeHandler}/></div>
}

const CountryDetails = ({name, capital, area, languages, flag}) => {
    const [weather, setWeather] = useState('');

    useEffect(() => {
        showCapitalWeather(capital)
    }, [])

    const showCapitalWeather = (capital) => {
        countriesService.getWeather(capital).then((data) => {
            setWeather({temp: data.current.temp_c, wind: Number(data.current.wind_mph) * 0.447, icon: data.current.condition.icon})
        })
    }

    const languagesNames = Object.values(languages)

    return <div>
        <h2>{name}</h2>
        <p>capital: <b>{capital}</b></p>
        <p>area: <b>{area}</b></p>
        <p>languages:</p>
        <ul>{languagesNames.map((l, index) => <li key={l}><b>{l}</b></li>)}
        </ul>
        <img className='flag' src={flag.png} alt={flag.alt}/>
        <h2>Weather in {capital}</h2>
        <div> temperature: {weather.temp} Celcius</div>
        <img src={weather.icon} />
        <div> wind: {weather.wind} m/s</div>

    </div>
}

const CountryName = ({name, onClickHandler}) => {
    return (<div>{name}
        <button onClick={() => onClickHandler(name)}>show</button>
    </div>)
}

const Countries = ({countriesList, showDetails, showCapitalWeather, weather}) => {
    if (!countriesList) {
        return null
    }

    if (countriesList.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }
    if (countriesList.length > 1 && countriesList.length <= 10) {
        return <div>{countriesList.map((country) => <CountryName key={country.tld}
                                                                 name={country.name}
                                                                 onClickHandler={showDetails}/>)}</div>
    }
    if (countriesList.length === 1) {
        const country = countriesList[0]
        return <CountryDetails name={country.name} capital={country.capital} area={country.area}
                               languages={country.languages} flag={country.flag}
                               />
    }

}

const App = () => {
    const [countries, setCountries] = useState(null)
    const [searchPhrase, setSearchPhrase] = useState('')


    useEffect(() => {
        countriesToShow()
    }, [searchPhrase])

    const extractData = ({name, capital, area, languages, tld, flags}) => {
        return ({
            name: name.common,
            capital,
            area,
            languages,
            tld,
            flag: flags
        })
    }

    const showCountryDetails = (name) => {
        const country = countries.find((c) => c.name === name);
        setCountries([country]);
    }

    const countriesToShow = () => {
        const countries = countriesService.getAll().then((returnedData) => returnedData.filter((country) => {
                return country.name.common.toLowerCase().includes(searchPhrase.toLowerCase())
            })
        )
        countries.then((countriesData) => {
            const countryExactMatch = countriesData.find((country) => country.name.common.toLowerCase() === searchPhrase.toLowerCase())

            const data = countryExactMatch ? [countryExactMatch] : countriesData
            setCountries(data.map((country) => extractData(country)))
        })
    }

    return (
        <div>
            <h2>Countries</h2>
            <Search searchPhrase={searchPhrase}
                    onChangeHandler={(event) => setSearchPhrase(event.target.value)}/>

            <div>
                <Countries countriesList={countries} showDetails={showCountryDetails}/>
            </div>
        </div>
    )
}

export default App