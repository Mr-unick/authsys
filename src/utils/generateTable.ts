import { UsserData } from "../../const";
import { haspermission } from "./authroization";
import { TablePropsResponseInstance } from "./instances";



export class GenerateTable {

  constructor(table) {

    const newTable: TablePropsResponseInstance = {
      name: table.name,
      title: `${table.name} Details`,
      update: haspermission(UsserData, `${table.name}_edit`),
      delete: haspermission(UsserData, `${table.name}_delete`),
      view: haspermission(UsserData, `${table.name}_view`),
      create: haspermission(UsserData, `${table.name}_create`),
      rows: table.data,
      columns: Object.keys(table.data[0])
    };

    return newTable ; 
  }
}
