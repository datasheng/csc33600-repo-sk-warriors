// lib/sqlUserId.js

const SQL_USER_KEY = "sql_user_id";

export function saveSqlUserId(id) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SQL_USER_KEY, String(id));
  }
}

export function getSqlUserId() {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem(SQL_USER_KEY);
    return val ? Number(val) : null;
  }
  return null;
}
