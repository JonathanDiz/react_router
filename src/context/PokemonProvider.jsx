import { useEffect, useState } from 'react'
import { useForm } from "../hook/useForm"
import { PokemonContext } from "./PokemonContext"

export const PokemonProvider = ({ children }) => {

  const [allPokemon, setAllPokemon] = useState([])
  const [globalPokemons, setGlobalPokemons] = useState([])
  const [offset, setOffset] = useState(0)

  // Utilizar CustomHook - useForm
  const {valueSearch, onInputChange, onResetForm} = useForm({
    valueSearch: ''
  })

  // Eastados simples para app
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(false)


  // llamar 50 pokemones a la API
  const getAllPokemons = async(limit = 50) => {
    const baseURL = 'https://pokeapi.co/api/v2/'

    const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`)
    const data = await res.json()
    console.log(data)

    const promises = data.results.map(async(pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json()
      return data
    })
    const results = await Promise.all(promises)

    setAllPokemon([
      ...allPokemon,
      ...results
    ])
    setLoading(false)
  }

  // llamar todos los pokemon
  const getGlobalPokemons = async() => {
    const baseURL = 'https://pokeapi.co/api/v2/'

    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`)
    const data = await res.json()
    console.log(data)

    const promises = data.results.map(async(pokemon) => {
      const res = await fetch(pokemon.url)
      const data = await res.json()
      return data
    })
    const results = await Promise.all(promises)

    setGlobalPokemons(results)
    setLoading(false)
  }

  // llamar Pokemon por ID
  const getPokemonByID = async(id) => {
    const baseURL = 'https://pokeapi.co/api/v2/'

    const res = await fetch(`${baseURL}pokemon/${id}`)
    const data = await res.json()
    return data
  }

  useEffect(() => {
    getAllPokemons()
  }, [])

  useEffect(() => {
    getGlobalPokemons()
  }, [])

  return (
    <PokemonContext.Provider value={{
      valueSearch,
      onInputChange,
      onResetForm,
      allPokemon,
      globalPokemons,
      getPokemonByID
    }}>
      {children}
    </PokemonContext.Provider>
  )
}