export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Group {
  id: string;
  user_id: string;
  name: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  email: string;
}

export interface Transfer {
  id: string;
  user_id: string | null;
  access_code: string;
  pin_hash: string;
  max_opens: number;
  current_opens: number;
  expires_at: string;
  status: "active" | "destroyed";
}

export interface TransferContent {
  id: string;
  transfer_id: string;
  content_type: "text" | "file";
  encrypted_blob: string;
  metadata?: Record<string, unknown> | null;
}

