import { createClient } from '@supabase/supabase-js'

// Supabase の接続情報は .env から読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase の環境変数が設定されていません。.env に VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください。',
  )
}

// アプリ全体で共有する Supabase クライアント
export const supabase = createClient(supabaseUrl, supabaseKey)
