# Guia de Migração — Projeto Lovable → Supabase Externo + Vercel

Este guia leva o código atual deste projeto para um **novo projeto Lovable** conectado ao **seu Supabase próprio** (`oxmhwwopxurwqcrwgsyf.supabase.co`), com deploy livre na Vercel e domínio próprio.

---

## 1. Exportar o código deste projeto

**Opção A — via GitHub (recomendado):**
1. Neste projeto: menu **(+)** no chat → **GitHub → Connect project**
2. Autorize o Lovable GitHub App e crie o repositório
3. O código fica sincronizado automaticamente em duas vias

**Opção B — download direto** (plano pago):
1. Code Editor → **Download codebase** (rodapé da sidebar)

---

## 2. Criar projeto novo SEM Lovable Cloud

1. Dashboard Lovable → **New Project**
2. ⚠️ **NÃO ative o Lovable Cloud** durante a criação
3. Comece com um projeto vazio

---

## 3. Conectar o SEU Supabase no projeto novo

1. No projeto novo: botão **Supabase** (canto superior direito) → **Connect Supabase**
2. Autorize e selecione o projeto `oxmhwwopxurwqcrwgsyf`
3. As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` são injetadas automaticamente

---

## 4. Rodar o SQL no SQL Editor do seu Supabase

```sql
-- =========================
-- PROSPECTS
-- =========================
CREATE TABLE public.prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL,
  cnpj text,
  owner_name text NOT NULL DEFAULT '',
  segment text NOT NULL DEFAULT 'Outros',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'Importação',
  potential text NOT NULL DEFAULT 'medio',
  status text NOT NULL DEFAULT 'nao_contatado',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prospects TO authenticated;
GRANT ALL ON public.prospects TO service_role;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own prospects" ON public.prospects
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================
-- INTERACTIONS
-- =========================
CREATE TABLE public.prospect_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  text text NOT NULL DEFAULT '',
  by_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prospect_interactions TO authenticated;
GRANT ALL ON public.prospect_interactions TO service_role;
ALTER TABLE public.prospect_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own prospect interactions" ON public.prospect_interactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================
-- IMPORTS (histórico)
-- =========================
CREATE TABLE public.prospect_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  performed_by text NOT NULL DEFAULT '',
  total_rows int NOT NULL DEFAULT 0,
  inserted_count int NOT NULL DEFAULT 0,
  updated_count int NOT NULL DEFAULT 0,
  skipped_count int NOT NULL DEFAULT 0,
  error_count int NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prospect_imports TO authenticated;
GRANT ALL ON public.prospect_imports TO service_role;
ALTER TABLE public.prospect_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own prospect imports" ON public.prospect_imports
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =========================
-- TRIGGER updated_at
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER prospects_set_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 5. Copiar o código para o projeto novo

Após conectar o GitHub no projeto novo, peça ao Lovable:

> "Importe o código deste repositório: `<seu-repo>`. Mantenha a integração Supabase usando `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`."

Ou via Git: clone o repo deste projeto e faça push para o repo do projeto novo — a sincronização Lovable ⇄ GitHub é automática.

---

## 6. Criar os usuários iniciais

No Supabase Dashboard → **Authentication → Users → Add user**:
- `valdinei@empresa.com` / senha
- `danielly@empresa.com` / senha

Ou use a tela de cadastro do app.

---

## 7. Migrar dados existentes (se já cadastrou coisas aqui)

1. Neste projeto: **Cloud → Database → Tables** → cada tabela → **Download CSV**
2. No seu Supabase: **Table Editor** → selecione a tabela → **Import data from CSV**

---

## 8. Deploy na Vercel com domínio próprio

1. Vercel → **Add New → Project** → importar o repo do GitHub
2. **Environment Variables**:
   - `VITE_SUPABASE_URL` = `https://oxmhwwopxurwqcrwgsyf.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (anon key do seu Supabase)
3. Deploy
4. **Settings → Domains** → adicionar seu domínio + configurar DNS conforme instruções da Vercel
5. No Supabase: **Authentication → URL Configuration** → adicione seu domínio em **Site URL** e **Redirect URLs**

---

## Variáveis de ambiente — resumo

| Variável | Onde | Valor |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel + Lovable | `https://oxmhwwopxurwqcrwgsyf.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel + Lovable | anon key |

✅ Pronto: código independente, banco seu, deploy seu, domínio seu.
