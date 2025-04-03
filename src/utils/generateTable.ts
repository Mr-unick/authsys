import { UsserData } from "../../const";
import { haspermission } from "./authroization";
import { TablePropsResponseInstance } from "./instances";



export class GenerateTable {

  private newtable: TablePropsResponseInstance;

  constructor(table) {

    this.newtable = {
      name: table.name,
      title: `${table.name} Details`,
      update: false,
      delete: false,
      view: false,
      create: false,
      assign: false,
      createform: {},
      updateform: {},
      formtype: 'modal',
      rows: table?.data.length > 0 ? table.data : [],
      columns: table?.data.length > 0 ? Object.keys(table?.data ? table.data[0] : {}) : []
    };
  }

  addform(url: string, formtype: string = 'modal') {

    this.newtable.createform = {
      method: 'post',
      formurl: url,

    };
    this.newtable.updateform = {
      method: 'put',
      formurl: url
    };

    return this;

  }

  formtype(type: string) {
    this.newtable.formtype = type;
    return this;
  }

  policy(user: object, policy: string) {

    this.newtable.update = haspermission(user, `update_${policy}`);
    this.newtable.create = haspermission(user, `create_${policy}`);
    this.newtable.delete = haspermission(user, `delete_${policy}`);
    this.newtable.view = haspermission(user, `view_${policy}`);
    this.newtable.assign = haspermission(user, `assign_${policy}`);

    return this;
  }

  gettable() {
    return this.newtable;
  }


}
