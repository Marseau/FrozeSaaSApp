# 🚀 CONFIGURAÇÃO MCP + SUPABASE

## ✅ INSTALAÇÃO COMPLETA

### **Pacotes MCP Instalados:**
- ✅ `@modelcontextprotocol/sdk` - SDK principal
- ✅ `@supabase/mcp-server-supabase` - Servidor oficial Supabase
- ✅ `@supabase/mcp-utils` - Utilidades Supabase  
- ✅ `@modelcontextprotocol/server-postgres` - Servidor PostgreSQL
- ✅ `@modelcontextprotocol/inspector` - Inspetor MCP

---

## 🔧 CONFIGURAÇÃO DO SUPABASE MCP

### **1. Configurar Credenciais Supabase**

Crie um arquivo `.env.local`:

```bash
# Suas credenciais do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_ANON_KEY=sua-anon-key
```

### **2. Configurar MCP no Claude Desktop**

No arquivo `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "https://seu-projeto.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "sua-service-role-key"
      }
    },
    "postgres": {
      "command": "npx", 
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@host:port/db"
      }
    }
  }
}
```

---

## 🎯 FUNCIONALIDADES DISPONÍVEIS

### **✅ Com @supabase/mcp-server-supabase:**

#### **🔍 RESOURCES (Recursos):**
- `supabase://tables` - Lista todas as tabelas
- `supabase://table/{nome}` - Schema específico da tabela
- `supabase://functions` - Lista Edge Functions
- `supabase://storage/buckets` - Lista buckets de storage

#### **🛠️ TOOLS (Ferramentas):**
- `supabase_query` - Executa queries SQL
- `supabase_insert` - Insere registros  
- `supabase_update` - Atualiza registros
- `supabase_delete` - Remove registros
- `supabase_upsert` - Insert/Update inteligente
- `supabase_rpc` - Chama funções armazenadas
- `supabase_storage_upload` - Upload de arquivos
- `supabase_storage_download` - Download de arquivos

#### **📝 PROMPTS (Templates):**
- `analyze_schema` - Análise do schema do banco
- `optimize_query` - Otimização de queries
- `create_migration` - Criação de migrações
- `debug_rls` - Debug de políticas RLS

---

## 🚀 EXEMPLOS DE USO

### **1. Aplicar Schema via MCP:**

```bash
# Via Claude Desktop com MCP configurado:
# "Execute o arquivo supabase_complete_schema.sql no meu projeto Supabase"
```

### **2. Validar Schema:**

```bash  
# Via Claude Desktop:
# "Analise o schema atual e compare com os arquivos .sql no meu projeto"
```

### **3. Gerar TypeScript Types:**

```bash
# Via Claude Desktop:
# "Gere os tipos TypeScript baseados no schema atual do Supabase"
```

---

## 🔍 TESTE DA CONFIGURAÇÃO

### **1. Verificar Instalação:**
```bash
npx @supabase/mcp-server-supabase --help
```

### **2. Testar Conexão:**
```bash
# Com suas credenciais configuradas
SUPABASE_URL=sua-url SUPABASE_SERVICE_ROLE_KEY=sua-key npx @supabase/mcp-server-supabase
```

### **3. Usar Inspector MCP:**
```bash
npx @modelcontextprotocol/inspector
```

---

## 🎯 PRÓXIMOS PASSOS

### **Para seu projeto FrozenSaaSApp:**

1. ✅ **MCP instalado** 
2. 🔄 **Configure credenciais** Supabase no `.env.local`
3. 🔄 **Configure Claude Desktop** com o `claude_desktop_config.json`
4. 🔄 **Teste conexão** com o Supabase
5. 🔄 **Execute schemas** via MCP
6. 🔄 **Valide correções** via MCP tools

### **Comandos Úteis:**

```bash
# Listar tabelas
# Via Claude: "Liste todas as tabelas do meu Supabase"

# Executar query
# Via Claude: "Execute SELECT count(*) FROM empresas"

# Aplicar migração  
# Via Claude: "Execute o arquivo supabase_corrections_clean.sql"

# Gerar types
# Via Claude: "Gere tipos TypeScript para todas as tabelas"
```

---

## 🚨 TROUBLESHOOTING

### **Erro "command not found":**
```bash
# Reinstalar globalmente
npm install -g @supabase/mcp-server-supabase
```

### **Erro de conexão Supabase:**
- ✅ Verifique URL do projeto
- ✅ Verifique Service Role Key  
- ✅ Verifique permissões do banco

### **Claude Desktop não vê MCP:**
- ✅ Reinicie Claude Desktop
- ✅ Verifique localização do config.json
- ✅ Valide JSON syntax

---

## 📚 DOCUMENTAÇÃO

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Supabase MCP Server](https://github.com/supabase/mcp-server-supabase)
- [Claude Desktop MCP Setup](https://docs.anthropic.com/claude/docs/mcp) 