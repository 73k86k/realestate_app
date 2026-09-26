import { supabase } from './supabaseClient'

// 物件テーブルに対する CRUD 操作をまとめたモジュール
// ※ どのユーザーの物件を操作できるかは Supabase 側の RLS で制御している

const COLUMNS = 'id, name, rent, area, layout, created_at, updated_at'

// 物件一覧を取得する（新しく登録した順）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select(COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 物件を新規登録する（user_id は DB 側でログイン中のユーザーIDが自動設定される）
export async function createProperty({ name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent, area, layout })
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 物件を更新する
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent, area, layout })
    .eq('id', id)
    .select(COLUMNS)
    .single()

  if (error) throw error
  return data
}

// 物件を削除する
export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id)
  if (error) throw error
}
