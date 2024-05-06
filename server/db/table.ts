import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

export interface Database {
  pet: PetTable
  room: RoomTable
}

/**
 * demo
 */
export interface PetTable {
  id: Generated<number>
  name: string
  owner_id: number
  species: 'dog' | 'cat'
}

export type Pet = Selectable<PetTable>
export type NewPet = Insertable<PetTable>
export type PetUpdate = Updateable<PetTable>

/**
 * room
 */
export interface RoomTable {
  id: Generated<string>
  botWxid: string
  wxid: string

  // '0' 开启，'1' 关闭
  open: string
  // 插件开启状态，数组
  openPlugins: string
  // 插件分组，逗号分隔的数组
  transferGroups: string
  // 排序
  order: number

  listenMembers: string

  // '0' 开启，'1' 关闭
  onlyListen: string // 只采集
}

export type Room = Selectable<RoomTable>
export type RoomReal = Selectable<
  Omit<RoomTable, 'openPlugins' | 'transferGroups' | 'listenMembers'> & {
    openPlugins: string[]
    transferGroups: string[]
    listenMembers: string[]
  }
>
export type NewRoom = Insertable<RoomTable>
export type RoomUpdate = Updateable<RoomTable>
