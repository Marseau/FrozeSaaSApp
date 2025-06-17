// Serviço para integração com API do ViaCEP
export interface EnderecoViaCEP {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export interface EnderecoFormatado {
  cep: string
  rua: string
  bairro: string
  cidade: string
  estado: string
  complemento?: string
}

/**
 * Busca endereço por CEP usando a API do ViaCEP
 */
export async function buscarCEP(cep: string): Promise<EnderecoFormatado | null> {
  try {
    // Remove caracteres não numéricos do CEP
    const cepLimpo = cep.replace(/\D/g, '')
    
    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos')
    }
    
    // Faz a requisição para a API do ViaCEP
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP')
    }
    
    const data: EnderecoViaCEP = await response.json()
    
    // Verifica se o CEP foi encontrado
    if ('erro' in data) {
      return null
    }
    
    // Retorna o endereço formatado
    return {
      cep: formatarCEP(data.cep),
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      complemento: data.complemento
    }
    
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}

/**
 * Formata CEP no padrão 00000-000
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Valida se o CEP está no formato correto
 */
export function validarCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

/**
 * Busca múltiplos CEPs em paralelo
 */
export async function buscarMultiplosCEPs(ceps: string[]): Promise<(EnderecoFormatado | null)[]> {
  const promises = ceps.map(cep => buscarCEP(cep))
  return Promise.all(promises)
}

/**
 * Busca CEP com cache local (localStorage)
 */
export async function buscarCEPComCache(cep: string): Promise<EnderecoFormatado | null> {
  const cepLimpo = cep.replace(/\D/g, '')
  const cacheKey = `cep_${cepLimpo}`
  
  // Verifica se existe no cache
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      // Remove cache corrompido
      localStorage.removeItem(cacheKey)
    }
  }
  
  // Busca na API
  const endereco = await buscarCEP(cep)
  
  // Salva no cache se encontrado
  if (endereco) {
    localStorage.setItem(cacheKey, JSON.stringify(endereco))
  }
  
  return endereco
} 