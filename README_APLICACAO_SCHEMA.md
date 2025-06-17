# 🗃️ GUIA DE APLICAÇÃO DO SCHEMA SUPABASE

## ⚠️ ORDEM CRÍTICA DE APLICAÇÃO

### **ERRO COMUM:** 
```
ERROR: 42P01: relation "pedidos" does not exist
```
**Causa:** Tentou aplicar correções antes do schema base.

---

## 📋 **PASSO A PASSO CORRETO:**

### **1️⃣ BACKUP (OBRIGATÓRIO)**
```bash
# Se já tiver dados, faça backup primeiro
pg_dump nome_do_banco > backup_antes_schema.sql
```

### **2️⃣ APLICAR SCHEMA BASE**
```bash
# Primeiro: Aplicar o schema original do Claude
psql -d nome_do_banco -f supabase_complete_schema.sql

# OU no Supabase Studio:
# - Vá em SQL Editor
# - Copie todo conteúdo de supabase_complete_schema.sql
# - Execute
```

### **3️⃣ VERIFICAR SE APLICOU CORRETAMENTE**
```sql
-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('empresas', 'produtos', 'pedidos', 'usuarios');

-- Deve retornar as 4 tabelas
```

### **4️⃣ APLICAR CORREÇÕES**
```bash
# Só depois: Aplicar as correções e melhorias
psql -d nome_do_banco -f supabase_schema_corrections.sql

# OU no Supabase Studio:
# - Copie todo conteúdo de supabase_schema_corrections.sql
# - Execute seção por seção
```

---

## 🔍 **VERIFICAÇÕES APÓS APLICAÇÃO:**

### **Tabelas Principais Criadas:**
```sql
-- Verificar estrutura das tabelas principais
\d empresas;
\d produtos;
\d pedidos;
\d usuarios;
```

### **Funções Criadas:**
```sql
-- Verificar se funções foram criadas
SELECT proname FROM pg_proc WHERE proname LIKE '%pedido%';
SELECT proname FROM pg_proc WHERE proname LIKE '%estoque%';
```

### **Triggers Ativos:**
```sql
-- Verificar triggers
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgname LIKE 'trigger_%';
```

---

## 🚨 **EM CASO DE ERRO:**

### **Se erro na aplicação do schema base:**
1. Verifique se está conectado no banco correto
2. Verifique permissões de usuário
3. Aplique seção por seção manualmente

### **Se erro na aplicação das correções:**
1. Certifique-se que schema base foi aplicado
2. Aplique seção por seção das correções
3. Pule seções que já foram aplicadas

---

## 📊 **DADOS DE TESTE (OPCIONAL):**

Após aplicar tudo, você pode inserir dados de teste:

```sql
-- Criar empresa de teste
INSERT INTO empresas (nome, email, telefone) VALUES 
('Restaurante Teste', 'teste@email.com', '11999999999');

-- Criar usuário de teste
INSERT INTO usuarios (nome, email) VALUES 
('Admin Teste', 'admin@teste.com');

-- Verificar se foi criado
SELECT * FROM empresas LIMIT 1;
SELECT * FROM usuarios LIMIT 1;
```

---

## ✅ **CHECKLIST FINAL:**

- [ ] Backup realizado
- [ ] Schema base aplicado (`supabase_complete_schema.sql`)
- [ ] Tabelas criadas (empresas, produtos, pedidos, etc.)
- [ ] Correções aplicadas (`supabase_schema_corrections.sql`)
- [ ] Funções criadas (gerar_numero_pedido, etc.)
- [ ] Triggers ativos
- [ ] Dados de teste inseridos
- [ ] Tudo funcionando sem erros

---

**🎯 Com essa ordem, seu banco estará 100% funcional e otimizado!** 