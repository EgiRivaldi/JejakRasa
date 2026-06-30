export interface RowDataPacket {
  [key: string]: any;
}

export interface ResultSetHeader {
  affectedRows: number;
  insertId: number;
  warningStatus?: number;
  fieldCount?: number;
  info?: string;
  serverStatus?: number;
  changedRows?: number;
}
