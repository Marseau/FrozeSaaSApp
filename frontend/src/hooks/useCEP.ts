import { useState, useCallback } from 'react'
import { buscarCEPComCache, EnderecoFormatado, validarCEP } from '../services/cep'

interface UseCEPState {
  endereco: EnderecoFormatado | null
  loading: boolean
  error: string | null
}

interface UseCEPReturn extends UseCEPState {
  buscarEndereco: (cep: string) => Promise<void>
  limparEndereco: () => void
  validarCEP: (cep: string) => boolean
}

/**
 * Hook para buscar endereços por CEP
 */
export function useCEP(): UseCEPReturn {
  const [state, setState] = useState<UseCEPState>({
    endereco: null,
    loading: false,
    error: null
  })

  const buscarEndereco = useCallback(async (cep: string) => {
    // Validação inicial
    if (!validarCEP(cep)) {
      setState(prev => ({
        ...prev,
        error: 'CEP inválido. Use o formato 00000-000',
        endereco: null
      }))
      return
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }))

    try {
      const endereco = await buscarCEPComCache(cep)
      
      if (endereco) {
        setState({
          endereco,
          loading: false,
          error: null
        })
      } else {
        setState({
          endereco: null,
          loading: false,
          error: 'CEP não encontrado'
        })
      }
    } catch (error) {
      setState({
        endereco: null,
        loading: false,
        error: 'Erro ao buscar CEP. Tente novamente.'
      })
    }
  }, [])

  const limparEndereco = useCallback(() => {
    setState({
      endereco: null,
      loading: false,
      error: null
    })
  }, [])

  return {
    ...state,
    buscarEndereco,
    limparEndereco,
    validarCEP
  }
} 