# 🚀 FrozenSaaSApp - Frontend

Frontend React para o sistema de delivery multi-tenant FrozenSaaSApp.

## 🛠️ **Tecnologias Utilizadas**

- **React 18** + TypeScript
- **Tailwind CSS** para estilização
- **Supabase** para backend
- **Radix UI** para componentes
- **Vite** para build e desenvolvimento
- **Lucide React** para ícones

## 📁 **Estrutura do Projeto**

```
frontend/
├── src/
│   ├── lib/
│   │   └── supabase.ts      # Configuração do Supabase
│   ├── components/          # Componentes React
│   ├── pages/              # Páginas da aplicação
│   └── types/              # Tipos TypeScript
├── public/                 # Arquivos estáticos
├── package.json           # Dependências
└── README.md             # Esta documentação
```

## 🔗 **Conexão com Backend**

- **URL:** `https://kuaxylxgyjygfmixkmhg.supabase.co`
- **Schema:** 30+ tabelas configuradas
- **Autenticação:** Supabase Auth
- **RLS:** Row Level Security ativo

## 🚀 **Como Executar**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📊 **Status Atual**

### ✅ **Configurado:**
- [x] Supabase client
- [x] Tipos TypeScript
- [x] Estrutura base
- [x] Dependências

### 🔄 **Em Desenvolvimento:**
- [ ] Componentes de UI
- [ ] Páginas principais
- [ ] Sistema de autenticação
- [ ] Dashboard admin
- [ ] Catálogo de produtos
- [ ] Sistema de pedidos

## 🎯 **Funcionalidades Planejadas**

1. **Autenticação Multi-tenant**
2. **Dashboard Administrativo**
3. **Gestão de Produtos**
4. **Sistema de Pedidos**
5. **Controle de Estoque**
6. **Relatórios e Analytics**
7. **Configurações da Empresa**

## 🔧 **Configuração**

O frontend está configurado para conectar automaticamente com o backend Supabase. As credenciais estão em `src/lib/supabase.ts`.

---

**Desenvolvido por:** Marseau  
**Projeto:** FrozenSaaSApp  
**Última atualização:** Janeiro 2025 