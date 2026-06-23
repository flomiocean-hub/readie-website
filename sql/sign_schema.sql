-- ============================================================
-- Readie Sign — 文件簽署平台 Schema
-- ============================================================

-- 預設服務品項庫
CREATE TABLE IF NOT EXISTS preset_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  default_price NUMERIC NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'NTD',
  sort_order   INT NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 預設品項（Readie AI 三個方案，最高價）
INSERT INTO preset_items (name, description, default_price, currency, sort_order) VALUES
  ('AI 導入健檢',      '到府兩小時訪談，產出現況評估報告與 AI 導入建議路線圖',          12000, 'NTD', 1),
  ('AI 工作流程建置',  '從 LINE 開始建置 AI 工作流程，含系統設定、教育訓練、上線驗收',  45000, 'NTD', 2),
  ('陪伴顧問（月費）', '每月確認使用狀況、優化流程、即時回覆問題',                       15000, 'NTD', 3)
ON CONFLICT DO NOTHING;

-- 文件主檔
CREATE TABLE IF NOT EXISTS documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type                TEXT NOT NULL CHECK (type IN ('nda', 'quote', 'service', 'custom')),
  contract_number     TEXT NOT NULL UNIQUE,
  status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'expired')),

  -- 客戶資料
  client_name         TEXT NOT NULL,
  client_company      TEXT,
  client_email        TEXT NOT NULL,
  client_phone        TEXT,

  -- NDA 專用變數（JSONB 彈性存）
  variables           JSONB NOT NULL DEFAULT '{}',

  -- 報價單專用
  line_items          JSONB NOT NULL DEFAULT '[]',
  -- line_items 格式：
  -- [{ "name": "AI 導入健檢", "description": "...", "unit_price": 12000, "qty": 1, "subtotal": 12000 }]
  discount_type       TEXT CHECK (discount_type IN ('percent', 'fixed') OR discount_type IS NULL),
  discount_value      NUMERIC,
  currency            TEXT NOT NULL DEFAULT 'NTD',
  payment_terms       TEXT CHECK (payment_terms IN ('full', 'split', 'custom') OR payment_terms IS NULL),
  payment_note        TEXT,
  valid_days          INT NOT NULL DEFAULT 30,
  note                TEXT,

  -- 簽署連結
  sign_token          TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
  token_expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),

  -- 簽署結果
  signed_at           TIMESTAMPTZ,
  signer_ip           TEXT,
  pdf_url             TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_status      ON documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_type        ON documents (type);
CREATE INDEX IF NOT EXISTS idx_documents_sign_token  ON documents (sign_token);
CREATE INDEX IF NOT EXISTS idx_documents_created_at  ON documents (created_at DESC);

-- 簽署事件（稽核記錄）
CREATE TABLE IF NOT EXISTS sign_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id         UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

  -- OTP 驗證
  otp_code            TEXT,
  otp_sent_at         TIMESTAMPTZ,
  otp_verified_at     TIMESTAMPTZ,

  -- 簽署
  signature_text      TEXT,
  signed_at           TIMESTAMPTZ,
  ip_address          TEXT,
  user_agent          TEXT,

  -- PDF
  pdf_generated_at    TIMESTAMPTZ,
  pdf_url             TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sign_events_document ON sign_events (document_id);

-- updated_at 自動更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_documents_updated_at ON documents;
CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Storage bucket（在 Supabase Dashboard 手動建立）
-- Bucket 名稱：signed-documents
-- Public：false（只有 service_role 可存取）
-- ============================================================
