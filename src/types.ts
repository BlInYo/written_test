export type AccountInfo = {
  id: string
  name: string
  email: string
  password: string
  create_time: number
  update_time: number
  status: AccountStatus
}

export enum AccountStatus {
  Active = 1,
  Delete = 2,
}

export enum AccountSex {
  Man = 1,
  Woman = 2,
}

export const AccountSexMap = {
  [AccountSex.Man]: '男',
  [AccountSex.Woman]: '女',
}
